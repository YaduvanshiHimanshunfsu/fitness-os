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

// ─── Helper: extract stats from v5 workout data ─────────────────────────

function extractStatsFromWorkouts(workouts: any[]) {
  let totalSets = 0
  let totalReps = 0
  const muscleMap: Record<string, number> = {}

  for (const w of workouts) {
    for (const we of w.workout_exercises_v5 || []) {
      const group = we.exercises?.muscle_group ?? 'unknown'
      for (const s of we.workout_sets_v5 || []) {
        if (s.completed) {
          totalSets++
          totalReps += s.actual_reps ?? 0
          muscleMap[group] = (muscleMap[group] ?? 0) + 1
        }
      }
    }
  }

  const topMuscleGroup = Object.entries(muscleMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return { totalSets, totalReps, muscleMap, topMuscleGroup }
}

// ─── Weekly Report ────────────────────────────────────────────────────────

export async function getWeeklyReport(userId: string): Promise<WeeklyReport> {
  const supabase = await createClient()

  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  // Query from v5 tables with nested joins
  const { data: workouts } = await supabase.from('workouts_v5')
    .select(`
      id, name, start_time, end_time,
      workout_exercises_v5(
        exercises(muscle_group),
        workout_sets_v5(actual_reps, completed)
      )
    `)
    .eq('profile_id', userId)
    .gte('start_time', monday.toISOString())
    .lte('start_time', sunday.toISOString())
    .order('start_time', { ascending: true })

  const sessions = workouts ?? []

  const { totalSets, totalReps } = extractStatsFromWorkouts(sessions)

  // Best day by sets
  const setsByDay: Record<string, number> = {}
  for (const w of sessions) {
    const dayName = new Date(w.start_time)
      .toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    let setsInWorkout = 0
    for (const we of w.workout_exercises_v5 || []) {
      setsInWorkout += (we.workout_sets_v5 || []).filter((s: any) => s.completed).length
    }
    setsByDay[dayName] = (setsByDay[dayName] ?? 0) + setsInWorkout
  }
  const bestDay = Object.entries(setsByDay).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  // Missed days
  const workoutDays = ['monday', 'tuesday', 'wednesday', 'friday', 'saturday', 'sunday']
  const completedDays = new Set(sessions.map((w: any) =>
    new Date(w.start_time).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  ))
  const missedDays = workoutDays
    .filter((d) => !completedDays.has(d))
    .filter((d) => {
      const dayIndex = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].indexOf(d)
      return dayIndex <= ((now.getDay() + 6) % 7)
    })
    .map((d) => d.charAt(0).toUpperCase() + d.slice(1))

  const weekLabel = `${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  return {
    weekLabel,
    workoutsCompleted: sessions.length,
    workoutsTarget:    6,
    totalSets,
    totalReps,
    completionRate:    Math.round((sessions.length / 6) * 100),
    bestDay:           bestDay.charAt(0).toUpperCase() + bestDay.slice(1),
    streakThisWeek:    sessions.length,
    missedDays,
  }
}

// ─── Monthly Report ───────────────────────────────────────────────────────

export async function getMonthlyReport(userId: string): Promise<MonthlyReport> {
  const supabase = await createClient()

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastOfMonth  = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  const { data: workouts } = await supabase.from('workouts_v5')
    .select(`
      id, start_time,
      workout_exercises_v5(
        exercises(muscle_group),
        workout_sets_v5(actual_reps, completed)
      )
    `)
    .eq('profile_id', userId)
    .gte('start_time', firstOfMonth.toISOString())
    .lte('start_time', lastOfMonth.toISOString())
    .order('start_time', { ascending: true })

  const sessions = workouts ?? []

  const { totalSets, totalReps, topMuscleGroup } = extractStatsFromWorkouts(sessions)

  // Best week
  const weekMap: Record<string, number> = {}
  for (const w of sessions) {
    const d = new Date(w.start_time)
    const weekStart = new Date(d)
    weekStart.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    weekMap[key] = (weekMap[key] ?? 0) + 1
  }
  const bestWeek = Object.entries(weekMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  // Streak from streaks table
  const { data: streakRow } = await supabase.from('streaks')
    .select('current_streak, best_streak')
    .eq('user_id', userId)
    .single()

  const totalWorkingDays = 26 // ~Mon–Sat for a full month
  return {
    monthLabel:        now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    workoutsCompleted: sessions.length,
    totalSets,
    totalReps,
    completionRate:    Math.min(100, Math.round((sessions.length / totalWorkingDays) * 100)),
    bestWeek:          bestWeek !== '—' ? `Week of ${bestWeek}` : '—',
    topMuscleGroup:    topMuscleGroup.charAt(0).toUpperCase() + topMuscleGroup.slice(1),
    currentStreak:     streakRow?.current_streak ?? 0,
    bestStreak:        streakRow?.best_streak    ?? 0,
  }
}

// ─── Yearly Report ────────────────────────────────────────────────────────

export async function getYearlyReport(userId: string): Promise<YearlyReport> {
  const supabase = await createClient()

  const year = new Date().getFullYear()

  const { data: workouts } = await supabase.from('workouts_v5')
    .select(`
      id, start_time, end_time,
      workout_exercises_v5(
        exercises(muscle_group),
        workout_sets_v5(actual_reps, completed)
      )
    `)
    .eq('profile_id', userId)
    .gte('start_time', `${year}-01-01T00:00:00.000Z`)
    .lte('start_time', `${year}-12-31T23:59:59.999Z`)

  const sessions = workouts ?? []

  const { totalSets, totalReps, topMuscleGroup } = extractStatsFromWorkouts(sessions)

  // Total active minutes
  const totalMinutes = sessions.reduce((acc: number, w: any) => {
    const start = new Date(w.start_time).getTime()
    const end = new Date(w.end_time).getTime()
    return acc + Math.round((end - start) / 60000)
  }, 0)

  // Best month
  const monthMap: Record<string, number> = {}
  for (const w of sessions) {
    const m = new Date(w.start_time).toLocaleDateString('en-US', { month: 'long' })
    monthMap[m] = (monthMap[m] ?? 0) + 1
  }
  const bestMonth = Object.entries(monthMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const { data: streakRow } = await supabase.from('streaks')
    .select('best_streak')
    .eq('user_id', userId)
    .single()

  const { data: profile } = await supabase.from('profiles')
    .select('xp_total')
    .eq('id', userId)
    .single()

  const { getLevelFromXP } = await import('@/utils/level-calculator')
  const { current: level } = getLevelFromXP(profile?.xp_total ?? 0)

  const totalWorkingDaysInYear = 313 // 365 minus 52 Thursdays
  return {
    year,
    totalWorkouts:    sessions.length,
    totalSets,
    totalReps,
    totalActiveHours: Math.round(totalMinutes / 60),
    completionRate:   Math.min(100, Math.round((sessions.length / totalWorkingDaysInYear) * 100)),
    bestMonth,
    longestStreak:    streakRow?.best_streak ?? 0,
    topMuscleGroup:   topMuscleGroup.charAt(0).toUpperCase() + topMuscleGroup.slice(1),
    levelReached:     level.name,
  }
}
