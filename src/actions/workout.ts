'use server'
import { createClient } from '@/lib/supabase/server'
import { calculateXP } from '@/utils/xp-calculator'
import { calculateNewStreak } from '@/utils/streak-calculator'
import { ACHIEVEMENTS } from '@/constants/achievements'

export async function saveWorkoutSession(payload: {
  day:             string
  startTime:       Date
  endTime:         Date
  completedSets:   { exerciseId: number; setNumber: number; actualReps: number; completed: boolean }[]
  completionScore: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const durationMinutes = Math.round(
    (payload.endTime.getTime() - payload.startTime.getTime()) / 60000
  )

  // 1. Insert workout_session
  const { data: session, error: sessionError } = await (supabase
    .from('workout_sessions') as any)
    .insert({
      user_id:          user.id,
      date:             new Date().toISOString().split('T')[0],
      day:              payload.day,
      start_time:       payload.startTime.toISOString(),
      end_time:         payload.endTime.toISOString(),
      duration_minutes: durationMinutes,
      completion_score: 0, // We will update this after inserting sets to ensure backend trust
    })
    .select()
    .single()

  if (sessionError) {
    console.error('Session Insert Error:', sessionError)
    throw new Error(sessionError.message || 'Failed to save session due to a database error')
  }
  if (!session) throw new Error('Failed to save session (no session returned)')

  // 2. Insert all workout_sets
  if (payload.completedSets.length > 0) {
    await (supabase.from('workout_sets') as any).insert(
      payload.completedSets.map((s) => ({
        session_id:  session.id,
        exercise_id: s.exerciseId,
        set_number:  s.setNumber,
        target_reps: '0',
        actual_reps: s.actualReps,
        completed:   s.completed,
      }))
    )
  }

  // 3. Update streak
  const { data: streak } = await (supabase
    .from('streaks') as any)
    .select()
    .eq('user_id', user.id)
    .single()

  const newStreak = calculateNewStreak(
    streak?.last_workout_date ? new Date(streak.last_workout_date) : null,
    streak?.current_streak ?? 0
  )

  await (supabase.from('streaks') as any).upsert({
    user_id:           user.id,
    current_streak:    newStreak,
    best_streak:       Math.max(newStreak, streak?.best_streak ?? 0),
    last_workout_date: new Date().toISOString().split('T')[0],
    updated_at:        new Date().toISOString(),
  })

  // 4. Calculate actual completion score based on sets passed
  const totalCompletedSets = payload.completedSets.filter(s => s.completed).length;
  // A simple mock of total required sets (ideally queried from workout_template_exercises)
  // For now, we compare completed vs total passed from frontend
  const totalPossibleSets = payload.completedSets.length;
  const actualCompletionScore = totalPossibleSets > 0 ? Math.round((totalCompletedSets / totalPossibleSets) * 100) : 0;

  // Update session with trusted score
  await (supabase.from('workout_sessions') as any).update({ completion_score: actualCompletionScore }).eq('id', session.id);

  // 5. XP — securely call increment_xp without user_id parameter
  const xpEarned = calculateXP(actualCompletionScore)
  await (supabase as any).rpc('increment_xp', { amount: xpEarned })

  // 5. Check achievements
  const { count: totalSets } = await (supabase
    .from('workout_sets') as any)
    .select('*', { count: 'exact', head: true })
    .eq('completed', true)
    .eq('session_id', session.id)

  const { count: totalWorkouts } = await (supabase
    .from('workout_sessions') as any)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const unlockedIds: number[] = []

  for (const a of ACHIEVEMENTS) {
    const alreadyUnlocked = await (supabase
      .from('user_achievements') as any)
      .select('id')
      .eq('user_id', user.id)
      .eq('achievement_id', a.id)
      .single()

    if (alreadyUnlocked.data) continue

    let qualifies = false
    if (a.conditionType === 'total_sets'     && (totalSets    ?? 0) >= a.conditionValue) qualifies = true
    if (a.conditionType === 'total_workouts' && (totalWorkouts ?? 0) >= a.conditionValue) qualifies = true
    if (a.conditionType === 'streak'         && newStreak            >= a.conditionValue) qualifies = true

    if (qualifies) {
      await (supabase.from('user_achievements') as any).insert({ user_id: user.id, achievement_id: a.id })
      unlockedIds.push(a.id)
    }
  }

  return { sessionId: session.id, xpEarned, unlockedAchievementIds: unlockedIds, newStreak }
}
