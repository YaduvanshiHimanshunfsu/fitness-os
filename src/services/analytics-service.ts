import { createClient } from '@/lib/supabase/server'

// ─── Types ───────────────────────────────────────────────────────────────

export interface HeatmapDay {
  date:      string   // 'YYYY-MM-DD'
  completed: boolean
  isRestDay: boolean  // Thursday
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
    .from('workout_sessions') as any)
    .select('date')
    .eq('user_id', userId)
    .gte('date', fromDate.toISOString().split('T')[0])
    .order('date', { ascending: true })

  const completedDates = new Set(((sessions ?? []) as any[]).map((s: any) => s.date))

  const result: HeatmapDay[] = []
  const cursor = new Date(fromDate)
  const today = new Date()

  while (cursor <= today) {
    const dateStr = cursor.toISOString().split('T')[0]
    const dayName = cursor.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    result.push({
      date:      dateStr,
      completed: completedDates.has(dateStr),
      isRestDay: dayName === 'thursday',
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return result
}

// ─── Weekly Chart ─────────────────────────────────────────────────────────

export async function getWeeklyChartData(userId: string): Promise<WeeklyChartData[]> {
  const supabase = await createClient()

  // Monday of this week
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const { data: sessions } = await (supabase
    .from('workout_sessions') as any)
    .select('date, workout_sets(count)')
    .eq('user_id', userId)
    .gte('date', monday.toISOString().split('T')[0])

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    const session = ((sessions ?? []) as any[]).find((s: any) => s.date === dateStr)
    return {
      week:      label,
      sets:      session ? (session.workout_sets as any)?.[0]?.count ?? 0 : 0,
      completed: !!session,
    }
  })
}

// ─── Monthly Chart ────────────────────────────────────────────────────────

export async function getMonthlyChartData(userId: string): Promise<MonthlyChartData[]> {
  const supabase = await createClient()

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const { data: sessions } = await (supabase
    .from('workout_sessions') as any)
    .select('date, workout_sets(count)')
    .eq('user_id', userId)
    .gte('date', firstOfMonth.toISOString().split('T')[0])
    .order('date', { ascending: true })

  // Group by date
  const map: Record<string, { sets: number; workouts: number }> = {}
  for (const s of (sessions as any[]) ?? []) {
    if (!map[s.date]) map[s.date] = { sets: 0, workouts: 0 }
    map[s.date].sets     += (s.workout_sets as any)?.[0]?.count ?? 0
    map[s.date].workouts += 1
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
    .from('workout_sessions') as any)
    .select('date, workout_sets(count)')
    .eq('user_id', userId)
    .gte('date', `${year}-01-01`)
    .lte('date', `${year}-12-31`)

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return months.map((label, i) => {
    const monthSessions = ((sessions ?? []) as any[]).filter((s: any) => {
      return new Date(s.date).getMonth() === i
    })
    return {
      month:    label,
      sets:     monthSessions.reduce((acc: number, s: any) => acc + ((s.workout_sets as any)?.[0]?.count ?? 0), 0),
      workouts: monthSessions.length,
    }
  })
}

// ─── Muscle Volume ────────────────────────────────────────────────────────

export async function getMuscleVolumeData(
  userId: string,
  period: 'week' | 'month' | 'year' = 'month'
): Promise<MuscleVolumeData[]> {
  const supabase = await createClient()

  const fromDate = new Date()
  if (period === 'week')  fromDate.setDate(fromDate.getDate() - 7)
  if (period === 'month') fromDate.setMonth(fromDate.getMonth() - 1)
  if (period === 'year')  fromDate.setFullYear(fromDate.getFullYear() - 1)

  const { data: sets } = await (supabase
    .from('workout_sets') as any)
    .select('exercise_id, exercises(muscle_group)')
    .eq('completed', true)
    .gte('timestamp', fromDate.toISOString())

  const volumeMap: Record<string, number> = {}
  for (const s of (sets as any[]) ?? []) {
    const group = (s.exercises as any)?.muscle_group ?? 'unknown'
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

  const [{ data: streakRow }, { count: totalWorkouts }, { count: totalSets }] =
    await Promise.all([
      (supabase.from('streaks') as any).select('*').eq('user_id', userId).single(),
      (supabase.from('workout_sessions') as any).select('*', { count: 'exact', head: true }).eq('user_id', userId),
      (supabase.from('workout_sets') as any).select('*', { count: 'exact', head: true }).eq('completed', true),
    ])

  const totalReps = await (supabase
    .from('workout_sets') as any)
    .select('actual_reps')
    .eq('completed', true)

  const sumReps = (totalReps.data ?? []).reduce((acc: number, r: any) => acc + (r.actual_reps ?? 0), 0)

  return {
    currentStreak:   streakRow?.current_streak   ?? 0,
    bestStreak:      streakRow?.best_streak       ?? 0,
    lastWorkoutDate: streakRow?.last_workout_date ?? null,
    totalWorkouts:   totalWorkouts                ?? 0,
    totalSets:       totalSets                    ?? 0,
    totalReps:       sumReps,
  }
}
