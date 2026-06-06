import { createClient } from '@/lib/supabase/server'

export interface WeeklyReport {
  weekLabel:        string   // 'Jun 2 – Jun 8, 2026'
  workoutsCompleted: number
  workoutsTarget:   number   // 6 (Mon–Sat)
  totalSets:        number
  totalReps:        number
  completionRate:   number   // 0–100
  bestDay:          string   // day with most sets
  streakThisWeek:   number
  missedDays:       string[] // ['Wednesday', 'Saturday']
}

export interface MonthlyReport {
  monthLabel:        string  // 'June 2026'
  workoutsCompleted: number
  totalSets:         number
  totalReps:         number
  completionRate:    number
  bestWeek:          string
  topMuscleGroup:    string
  currentStreak:     number
  bestStreak:        number
}

export interface YearlyReport {
  year:              number
  totalWorkouts:     number
  totalSets:         number
  totalReps:         number
  totalActiveHours:  number
  completionRate:    number
  bestMonth:         string
  longestStreak:     number
  topMuscleGroup:    string
  levelReached:      string
}

export async function getWeeklyReport(userId: string): Promise<WeeklyReport> {
  const supabase = await createClient()

  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const { data: sessions } = await (supabase
    .from('workout_sessions') as any)
    .select('date, day, duration_minutes, workout_sets(actual_reps, completed)')
    .eq('user_id', userId)
    .gte('date', monday.toISOString().split('T')[0])
    .lte('date', sunday.toISOString().split('T')[0])

  const totalSets = ((sessions ?? []) as any[]).reduce((acc: number, s: any) => {
    return acc + (((s.workout_sets as any[]) ?? [])).filter((w: any) => w.completed).length
  }, 0)

  const totalReps = ((sessions ?? []) as any[]).reduce((acc: number, s: any) => {
    return acc + (((s.workout_sets as any[]) ?? [])).reduce((a: number, w: any) => a + (w.actual_reps ?? 0), 0)
  }, 0)

  const setsByDay: Record<string, number> = {}
  for (const s of (sessions as any[]) ?? []) {
    setsByDay[s.day] = (((s.workout_sets as any[]) ?? [])).filter((w: any) => w.completed).length
  }
  const bestDay = Object.entries(setsByDay).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const workoutDays = ['monday', 'tuesday', 'wednesday', 'friday', 'saturday', 'sunday']
  const completedDays = new Set(((sessions ?? []) as any[]).map((s: any) => s.day))
  const missedDays = workoutDays
    .filter((d) => !completedDays.has(d))
    .filter((d) => {
      // Only count days that have already passed this week
      const dayIndex = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].indexOf(d)
      return dayIndex <= ((now.getDay() + 6) % 7)
    })
    .map((d) => d.charAt(0).toUpperCase() + d.slice(1))

  const weekLabel = `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  return {
    weekLabel,
    workoutsCompleted: (sessions ?? []).length,
    workoutsTarget:    6,
    totalSets,
    totalReps,
    completionRate:    Math.round(((sessions ?? []).length / 6) * 100),
    bestDay:           bestDay.charAt(0).toUpperCase() + bestDay.slice(1),
    streakThisWeek:    (sessions ?? []).length,
    missedDays,
  }
}

export async function getMonthlyReport(userId: string): Promise<MonthlyReport> {
  const supabase = await createClient()

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastOfMonth  = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const { data: sessions } = await (supabase
    .from('workout_sessions') as any)
    .select('date, day, workout_sets(actual_reps, completed, exercises(muscle_group))')
    .eq('user_id', userId)
    .gte('date', firstOfMonth.toISOString().split('T')[0])
    .lte('date', lastOfMonth.toISOString().split('T')[0])

  const totalSets = ((sessions ?? []) as any[]).reduce((acc: number, s: any) =>
    acc + (((s.workout_sets as any[]) ?? [])).filter((w: any) => w.completed).length, 0)

  const totalReps = ((sessions ?? []) as any[]).reduce((acc: number, s: any) =>
    acc + (((s.workout_sets as any[]) ?? [])).reduce((a: number, w: any) => a + (w.actual_reps ?? 0), 0), 0)

  // Top muscle group
  const muscleMap: Record<string, number> = {}
  for (const s of (sessions as any[]) ?? []) {
    for (const w of ((s.workout_sets as any[]) ?? [])) {
      if (w.completed) {
        const mg = w.exercises?.muscle_group ?? 'unknown'
        muscleMap[mg] = (muscleMap[mg] ?? 0) + 1
      }
    }
  }
  const topMuscleGroup = Object.entries(muscleMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  // Best week: which 7-day span had the most workouts
  const weekMap: Record<string, number> = {}
  for (const s of (sessions as any[]) ?? []) {
    const d = new Date(s.date)
    const weekStart = new Date(d)
    weekStart.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    weekMap[key] = (weekMap[key] ?? 0) + 1
  }
  const bestWeek = Object.entries(weekMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const { data: streakRow } = await (supabase
    .from('streaks') as any).select('current_streak, best_streak').eq('user_id', userId).single()

  const totalWorkingDays = 26 // ~Mon–Sat for a full month
  return {
    monthLabel:        now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    workoutsCompleted: (sessions ?? []).length,
    totalSets,
    totalReps,
    completionRate:    Math.min(100, Math.round(((sessions ?? []).length / totalWorkingDays) * 100)),
    bestWeek:          bestWeek !== '—' ? `Week of ${bestWeek}` : '—',
    topMuscleGroup:    topMuscleGroup.charAt(0).toUpperCase() + topMuscleGroup.slice(1),
    currentStreak:     streakRow?.current_streak ?? 0,
    bestStreak:        streakRow?.best_streak    ?? 0,
  }
}

export async function getYearlyReport(userId: string): Promise<YearlyReport> {
  const supabase = await createClient()

  const year = new Date().getFullYear()

  const { data: sessions } = await (supabase
    .from('workout_sessions') as any)
    .select('date, duration_minutes, workout_sets(actual_reps, completed, exercises(muscle_group))')
    .eq('user_id', userId)
    .gte('date', `${year}-01-01`)
    .lte('date', `${year}-12-31`)

  const totalSets = ((sessions ?? []) as any[]).reduce((acc: number, s: any) =>
    acc + (((s.workout_sets as any[]) ?? [])).filter((w: any) => w.completed).length, 0)

  const totalReps = ((sessions ?? []) as any[]).reduce((acc: number, s: any) =>
    acc + (((s.workout_sets as any[]) ?? [])).reduce((a: number, w: any) => a + (w.actual_reps ?? 0), 0), 0)

  const totalMinutes = ((sessions ?? []) as any[]).reduce((acc: number, s: any) => acc + (s.duration_minutes ?? 0), 0)

  const muscleMap: Record<string, number> = {}
  for (const s of (sessions as any[]) ?? []) {
    for (const w of ((s.workout_sets as any[]) ?? [])) {
      if (w.completed) {
        const mg = w.exercises?.muscle_group ?? 'unknown'
        muscleMap[mg] = (muscleMap[mg] ?? 0) + 1
      }
    }
  }
  const topMuscleGroup = Object.entries(muscleMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const monthMap: Record<string, number> = {}
  for (const s of (sessions as any[]) ?? []) {
    const m = new Date(s.date).toLocaleDateString('en-US', { month: 'long' })
    monthMap[m] = (monthMap[m] ?? 0) + 1
  }
  const bestMonth = Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const { data: streakRow } = await (supabase
    .from('streaks') as any).select('best_streak').eq('user_id', userId).single()
  const { data: profile }   = await (supabase
    .from('profiles') as any).select('xp_total').eq('id', userId).single()

  const { getLevelFromXP } = await import('@/utils/level-calculator')
  const { current: level } = getLevelFromXP(profile?.xp_total ?? 0)

  const totalWorkingDaysInYear = 313 // 365 minus 52 Thursdays
  return {
    year,
    totalWorkouts:    (sessions ?? []).length,
    totalSets,
    totalReps,
    totalActiveHours: Math.round(totalMinutes / 60),
    completionRate:   Math.min(100, Math.round(((sessions ?? []).length / totalWorkingDaysInYear) * 100)),
    bestMonth,
    longestStreak:    streakRow?.best_streak ?? 0,
    topMuscleGroup:   topMuscleGroup.charAt(0).toUpperCase() + topMuscleGroup.slice(1),
    levelReached:     level.name,
  }
}
