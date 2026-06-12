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

  const { data: sessions } = await (supabase
    .from('workouts_v5') as any)
    .select('start_time, workout_exercises_v5(workout_sets_v5(id))')
    .eq('profile_id', userId)
    .gte('start_time', fromDate.toISOString())
    .order('start_time', { ascending: true })

  // Correct for UTC drift by extracting local YYYY-MM-DD from the DB timestamps
  const dateSetsMap: Record<string, number> = {}
  
  for (const s of (sessions as any[]) ?? []) {
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

  const { data: sessions } = await (supabase
    .from('workouts_v5') as any)
    .select('start_time, workout_exercises_v5(workout_sets_v5(id))')
    .eq('profile_id', userId)
    .gte('start_time', firstOfMonth.toISOString())
    .order('start_time', { ascending: true })

  // Group by date
  const map: Record<string, { sets: number; workouts: number }> = {}
  for (const s of (sessions as any[]) ?? []) {
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

  const { data: sessions } = await (supabase
    .from('workouts_v5') as any)
    .select('start_time, workout_exercises_v5(workout_sets_v5(id))')
    .eq('profile_id', userId)
    .gte('start_time', `${year}-01-01T00:00:00.000Z`)
    .lte('start_time', `${year}-12-31T23:59:59.999Z`)

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return months.map((label, i) => {
    const monthSessions = ((sessions ?? []) as any[]).filter((s: any) => {
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

  // Join workout_sets -> workout_exercises -> exercises, and filter by user via workouts
  const { data: sets } = await (supabase
    .from('workout_sets_v5') as any)
    .select('workout_exercises_v5!inner(exercises(muscle_group), workouts_v5!inner(profile_id, start_time))')
    .eq('completed', true)
    .eq('workout_exercises_v5.workouts_v5.profile_id', userId)
    .gte('workout_exercises_v5.workouts_v5.start_time', fromDate.toISOString())

  const volumeMap: Record<string, number> = {}
  for (const s of (sets as any[]) ?? []) {
    const group = s.workout_exercises_v5?.exercises?.muscle_group ?? 'unknown'
    volumeMap[group] = (volumeMap[group] ?? 0) + 1
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

  const [{ count: totalWorkouts }, { count: totalSets }] =
    await Promise.all([
      (supabase.from('workouts_v5') as any).select('*', { count: 'exact', head: true }).eq('profile_id', userId),
      (supabase.from('workout_sets_v5') as any).select('workout_exercises_v5!inner(workout_id)', { count: 'exact', head: true }).eq('completed', true).eq('workout_exercises_v5.workouts_v5.profile_id', userId),
    ])

  const { data: profile } = await (supabase.from('profiles') as any).select('current_streak, longest_streak').eq('id', userId).single()

  const totalReps = await (supabase
    .from('workout_sets_v5') as any)
    .select('actual_reps')
    .eq('completed', true)
    .eq('workout_exercises_v5.workouts_v5.profile_id', userId)

  const sumReps = (totalReps.data ?? []).reduce((acc: number, r: any) => acc + (r.actual_reps ?? 0), 0)

  return {
    currentStreak:   profile?.current_streak   ?? 0,
    bestStreak:      profile?.longest_streak   ?? 0,
    lastWorkoutDate: null,
    totalWorkouts:   totalWorkouts                ?? 0,
    totalSets:       totalSets                    ?? 0,
    totalReps:       sumReps,
  }
}
