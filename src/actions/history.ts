'use server'
import { createClient } from '@/lib/supabase/server'

export async function getWorkoutDatesForMonth(year: number, month: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // month is 0-indexed in JS Date, but for SQL we need 'YYYY-MM'
  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

  const { data, error } = await (supabase
    .from('workouts_v5') as any)
    .select('start_time, xp_earned')
    .eq('profile_id', user.id)
    .gte('start_time', startDate.toISOString())
    .lte('start_time', endDate.toISOString())

  if (error) {
    console.error('getWorkoutDates Error:', error)
    return []
  }

  const workedOutDates = data.map((workout: any) => {
    return {
      date: workout.start_time,
      xp: workout.xp_earned
    };
  });

  return workedOutDates;
}

export async function getWorkoutDetailsForDate(dateStr: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Parse local date bounds safely to UTC
  const localDate = new Date(dateStr)
  // Shift to start of day local -> UTC approx
  const startOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0)
  const endOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 23, 59, 59)

  const { data: workouts, error } = await (supabase
    .from('workouts_v5') as any)
    .select(`
      id, name, start_time, end_time, xp_earned, sets_skipped, exercises_skipped, estimated_calories,
      workout_exercises_v5 (
        id, exercise_id, sets_skipped, exercises(name, muscle_group),
        workout_sets_v5 (id, actual_reps, weight_kg, completed)
      )
    `)
    .eq('profile_id', user.id)
    .gte('start_time', startOfDay.toISOString())
    .lte('start_time', endOfDay.toISOString())
    .order('start_time', { ascending: false })

  if (error) {
    console.error('getWorkoutDetails Error:', error)
    return null
  }

  if (!workouts || workouts.length === 0) return null

  // Process the first workout of the day (assuming 1 per day for summary simplicity)
  const w = workouts[0]
  
  let totalSets = 0
  let completedSets = 0
  let totalVolumeKg = 0

  for (const we of w.workout_exercises_v5 || []) {
    for (const ws of we.workout_sets_v5 || []) {
      totalSets++
      if (ws.completed) {
        completedSets++
        totalVolumeKg += ws.weight_kg * ws.actual_reps
      }
    }
  }

  const durationMin = Math.round((new Date(w.end_time).getTime() - new Date(w.start_time).getTime()) / 60000)

  return {
    name: w.name,
    xp: w.xp_earned,
    durationMin,
    calories: w.estimated_calories,
    skippedExercises: w.exercises_skipped,
    skippedSets: w.sets_skipped,
    totalSets,
    completedSets,
    volumeKg: totalVolumeKg,
  }
}
