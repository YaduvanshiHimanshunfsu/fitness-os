'use server'
import { createClient } from '@/lib/supabase/server'
import { calculateXP } from '@/utils/xp-calculator'
import { calculateNewStreak } from '@/utils/streak-calculator'
import { ACHIEVEMENTS } from '@/constants/achievements'

import { checkAndUpdateRecords } from '@/services/record-service'

export async function saveWorkoutSession(payload: {
  day:             string
  startTime:       Date
  endTime:         Date
  completedSets:   { exerciseId: number; setNumber: number; actualReps: number; completed: boolean; weight_kg?: number; unit?: string }[]
  completionScore: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const durationMinutes = Math.round(
    (payload.endTime.getTime() - payload.startTime.getTime()) / 60000
  )

  // 1. Pre-calculate metrics
  const totalSets = payload.completedSets.length
  const completedSetsCount = payload.completedSets.filter(s => s.completed).length
  const setsSkipped = totalSets - completedSetsCount
  const actualCompletionScore = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0
  const xpEarned = calculateXP(actualCompletionScore)

  // Group sets by exercise
  const exerciseMap = new Map<number, typeof payload.completedSets>()
  for (const s of payload.completedSets) {
    if (!exerciseMap.has(s.exerciseId)) exerciseMap.set(s.exerciseId, [])
    exerciseMap.get(s.exerciseId)!.push(s)
  }

  let exercisesSkipped = 0
  for (const sets of exerciseMap.values()) {
    if (sets.every(s => !s.completed)) exercisesSkipped++
  }

  // Calculate volume to estimate calories and check for new records
  let totalVolumeKg = 0
  let newRecordsHit = false;

  for (const s of payload.completedSets) {
    if (s.completed && s.weight_kg) {
      const weight = s.unit === 'lbs' ? s.weight_kg * 0.453592 : s.weight_kg
      totalVolumeKg += weight * s.actualReps
      
      // Check PR
      const isNewRecord = await checkAndUpdateRecords(user.id, s.exerciseId.toString(), s.actualReps, weight, null);
      if (isNewRecord) newRecordsHit = true;
    }
  }
  const estimatedCalories = Math.round(totalVolumeKg * 0.00205)

  // 2. Insert workout
  const { data: workout, error: workoutError } = await supabase.from()
    .insert({
      profile_id:        user.id,
      name:              payload.day, // Using day as name for now
      start_time:        payload.startTime.toISOString(),
      end_time:          payload.endTime.toISOString(),
      xp_earned:         xpEarned,
      sets_skipped:      setsSkipped,
      exercises_skipped: exercisesSkipped,
      estimated_calories: estimatedCalories
    })
    .select()
    .single()

  if (workoutError || !workout) {
    console.error('Workout Insert Error:', workoutError)
    throw new Error(workoutError?.message || 'Failed to save workout')
  }

  // 3. Insert exercises and sets
  let orderIndex = 0
  for (const [exerciseId, sets] of exerciseMap.entries()) {
    const exerciseSetsSkipped = sets.filter(s => !s.completed).length

    const { data: we, error: weError } = await supabase.from()
      .insert({
        workout_id:   workout.id,
        exercise_id:  exerciseId,
        order_index:  orderIndex++,
        sets_skipped: exerciseSetsSkipped
      })
      .select()
      .single()

    if (weError || !we) {
      console.error('Failed to insert workout_exercise:', weError, exerciseId);
      continue;
    }

    const { error: setsError } = await supabase.from().insert(
      sets.map(s => ({
        workout_exercise_id: we.id,
        actual_reps:  s.actualReps,
        weight_kg:    s.weight_kg ?? 0,
        unit:         s.unit ?? 'kg',
        completed:    s.completed,
      }))
    )

    if (setsError) {
      console.error('Failed to insert workout sets:', setsError);
      throw new Error(setsError.message || 'Failed to save workout sets')
    }
  }

  // 4. Update streak — read from `streaks` table, calculate, and write back
  const { data: streakRow } = await supabase.from()
    .select('current_streak, best_streak, last_workout_date')
    .eq('user_id', user.id)
    .single()

  const lastWorkoutDate = streakRow?.last_workout_date ? new Date(streakRow.last_workout_date) : null
  const currentStreak = streakRow?.current_streak ?? 0
  const bestStreak = streakRow?.best_streak ?? 0
  const newStreak = calculateNewStreak(lastWorkoutDate, currentStreak)
  const newBestStreak = Math.max(bestStreak, newStreak)

  const { error: streakError } = await supabase.from()
    .upsert({
      user_id:            user.id,
      current_streak:     newStreak,
      best_streak:        newBestStreak,
      last_workout_date:  new Date().toISOString().split('T')[0],
      updated_at:         new Date().toISOString(),
    }, { onConflict: 'user_id' })

  if (streakError) {
    console.error('Streak update error:', streakError)
  }

  // 5. XP update
  const { error: xpError } = await (supabase as any).rpc('increment_xp', { amount: xpEarned })
  if (xpError) {
    throw new Error(xpError.message || 'Failed to update XP')
  }

  // 6. Check and unlock achievements after workout save
  try {
    const { checkAndUnlockAchievements } = await import('@/services/achievement-service')
    await checkAndUnlockAchievements(user.id)
  } catch (e) {
    console.error('Achievement check error:', e)
  }

  // Return info for summary dashboard
  return { sessionId: workout.id, xpEarned, newStreak, newRecordsHit }
}
