import { createClient } from '@/lib/supabase/server'

// ─── Types ───────────────────────────────────────────────────────────────

export interface HeatmapDay {
  date:      string   // 'YYYY-MM-DD'
  completed: boolean
  isRestDay: boolean  // Thursday
  sets:      number
}

export interface WeeklyChartData {
  week:      string   // 'Mon', 'Tue', etc.
  sets:      number
  completed: boolean
}

export interface MonthlyChartData {
  date:       string  // 'Jun 1', 'Jun 2', etc.
  sets:       number
  workouts:   number
}

export interface YearlyChartData {
  month:    string    // 'Jan', 'Feb', etc.
  sets:     number
  workouts: number
}

export interface MuscleVolumeData {
  muscleGroup: string
  sets:        number
  percentage:  number
}

export interface StreakData {
  currentStreak:   number
  bestStreak:      number
  lastWorkoutDate: string | null
  totalWorkouts:   number
  totalSets:       number
  totalReps:       number
}

// ─── Heatmap ─────────────────────────────────────────────────────────────

export async function getHeatmapData(userId: string, days = 365): Promise<HeatmapDay[]> {
  const supabase = await createClient()

  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)

  const { data: sessions } = await supabase
    .from('workouts_v5')
    .select('start_time, workout_exercises_v5(workout_sets_v5(id))')
    .eq('profile_id', userId)
    .gte('start_time', fromDate.toISOString())
    .order('start_time', { ascending: true })

  // Correct for UTC drift by extracting local YYYY-MM-DD from the DB timestamps
  const dateSetsMap: Record<string, number> = {}
  
  for (const s of sessions ?? []) {
    const d = new Date(s.start_time)
    const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0]
    
    let setCount = 0
    for (const we of s.workout_exercises_v5 || []) {
      setCount += (we.workout_sets_v5 || []).length
    }
    dateSetsMap[localDate] = (dateSetsMap[localDate] || 0) + setCount
  }

  const result: HeatmapDay[] = []
  const cursor = new Date(fromDate)
  const today = new Date()

  while (cursor <= today) {
    const dateStr = cursor.toISOString().split('T')[0]
    const dayName = cursor.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    result.push({
      date:      dateStr,
      completed: !!dateSetsMap[dateStr],
      isRestDay: dayName === 'thursday',
      sets:      dateSetsMap[dateStr] || 0
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return result
}

// ─── Weekly Chart ─────────────────────────────────────────────────────────

export async function getWeeklyChartData(userId: string): Promise<WeeklyChartData[]> {
  const supabase = await createClient()

  // As per P1: Use mv_weekly_volume
  const { data: weeklyVols, error } = await supabase
    .from('mv_weekly_volume_v5')
    .select('*')
    .eq('profile_id', userId)
    .order('week_start', { ascending: true })
    .limit(8)

  if (error || !weeklyVols) return []

  return weeklyVols.map((v: any) => {
    // Label as 'Jun 1' or 'Wk 24'
    const d = new Date(v.week_start)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return {
      week: label,
      sets: v.sets_completed ?? 0,
      completed: (v.sets_completed ?? 0) > 0,
    }
  })
}

// ─── Monthly Chart ────────────────────────────────────────────────────────

export async function getMonthlyChartData(userId: string): Promise<MonthlyChartData[]> {
  const supabase = await createClient()

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const { data: sessions } = await supabase.from()
    .select('start_time, workout_exercises_v5(workout_sets_v5(id))')
    .eq('profile_id', userId)
    .gte('start_time', firstOfMonth.toISOString())
    .order('start_time', { ascending: true })

  // Group by date
  const map: Record<string, { sets: number; workouts: number }> = {}
  for (const s of sessions ?? []) {
    const d = new Date(s.start_time)
    const localDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0]
    
    if (!map[localDate]) map[localDate] = { sets: 0, workouts: 0 }
    
    // Count sets by checking inner arrays
    let setCount = 0
    for (const we of s.workout_exercises_v5 || []) {
      setCount += (we.workout_sets_v5 || []).length
    }
    
    map[localDate].sets += setCount
    map[localDate].workouts += 1
  }

  const result: MonthlyChartData[] = []
  const cursor = new Date(firstOfMonth)
  while (cursor <= now) {
    const dateStr = cursor.toISOString().split('T')[0]
    const label   = cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    result.push({
      date:     label,
      sets:     map[dateStr]?.sets     ?? 0,
      workouts: map[dateStr]?.workouts ?? 0,
    })
    cursor.setDate(cursor.getDate() + 1)
  }
  return result
}

// ─── Yearly Chart ─────────────────────────────────────────────────────────

export async function getYearlyChartData(userId: string): Promise<YearlyChartData[]> {
  const supabase = await createClient()

  const year = new Date().getFullYear()

  const { data: sessions } = await supabase.from()
    .select('start_time, workout_exercises_v5(workout_sets_v5(id))')
    .eq('profile_id', userId)
    .gte('start_time', `${year}-01-01T00:00:00.000Z`)
    .lte('start_time', `${year}-12-31T23:59:59.999Z`)

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return months.map((label, i) => {
    const monthSessions = (sessions ?? []).filter((s: any) => {
      return new Date(s.start_time).getMonth() === i
    })
    
    const totalSets = monthSessions.reduce((acc: number, s: any) => {
      let setCount = 0
      for (const we of s.workout_exercises_v5 || []) {
        setCount += (we.workout_sets_v5 || []).length
      }
      return acc + setCount
    }, 0)

    return {
      month:    label,
      sets:     totalSets,
      workouts: monthSessions.length,
    }
  })
}

export async function getMuscleVolumeData(
  userId: string,
  period: 'week' | 'month' | 'year' = 'month'
): Promise<MuscleVolumeData[]> {
  const supabase = await createClient()

  const fromDate = new Date()
  if (period === 'week')  fromDate.setDate(fromDate.getDate() - 7)
  if (period === 'month') fromDate.setMonth(fromDate.getMonth() - 1)
  if (period === 'year')  fromDate.setFullYear(fromDate.getFullYear() - 1)

  const { data: workouts } = await supabase
    .from('workouts_v5')
    .select(`
      workout_exercises_v5(
        exercises(muscle_group),
        workout_sets_v5(id, completed)
      )
    `)
    .eq('profile_id', userId)
    .gte('start_time', fromDate.toISOString())

  const volumeMap: Record<string, number> = {}
  for (const w of workouts ?? []) {
    for (const we of w.workout_exercises_v5 || []) {
      const group = we.exercises?.muscle_group ?? 'unknown'
      const completedSets = (we.workout_sets_v5 || []).filter((s: any) => s.completed).length
      volumeMap[group] = (volumeMap[group] ?? 0) + completedSets
    }
  }

  const total = Object.values(volumeMap).reduce((a, b) => a + b, 0) || 1

  return Object.entries(volumeMap)
    .sort((a, b) => b[1] - a[1])
    .map(([muscleGroup, sets]) => ({
      muscleGroup,
      sets,
      percentage: Math.round((sets / total) * 100),
    }))
}

// ─── Streak + Lifetime Stats ───────────────────────────────────────────────

export async function getStreakData(userId: string): Promise<StreakData> {
  const supabase = await createClient()

  const { count: totalWorkouts } = await supabase.from()
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId)

  const { data: workoutsWithSets } = await supabase.from()
    .select('workout_exercises_v5(workout_sets_v5(actual_reps, completed))')
    .eq('profile_id', userId)

  let totalSetsCount = 0
  let totalRepsCount = 0
  for (const w of workoutsWithSets ?? []) {
    for (const we of w.workout_exercises_v5 || []) {
      for (const s of we.workout_sets_v5 || []) {
        if (s.completed) {
          totalSetsCount++
          totalRepsCount += s.actual_reps ?? 0
        }
      }
    }
  }

  const { data: streakRow } = await supabase.from()
    .select('current_streak, best_streak, last_workout_date')
    .eq('user_id', userId)
    .single()

  return {
    currentStreak:   streakRow?.current_streak   ?? 0,
    bestStreak:      streakRow?.best_streak       ?? 0,
    lastWorkoutDate: streakRow?.last_workout_date ?? null,
    totalWorkouts:   totalWorkouts                ?? 0,
    totalSets:       totalSetsCount,
    totalReps:       totalRepsCount,
  }
}
