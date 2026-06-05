import { createClient } from '@/lib/supabase/server'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard'
import { StartWorkoutButton } from '@/components/dashboard/StartWorkoutButton'
import { StreakCounter } from '@/components/dashboard/StreakCounter'
import { WorkoutHeatmap } from '@/components/heatmap/WorkoutHeatmap'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { getTodayDay, isRestDay } from '@/utils/date-utils'
import { EXERCISES } from '@/constants/exercises'
import { getLevelFromXP } from '@/utils/level-calculator'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null // Middleware will redirect
  }

  // Fetch Profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  // Fetch Streak
  const { data: streak } = await supabase.from('streaks').select('*').eq('user_id', user.id).single()
  
  // Fetch Total Workouts
  const { count: totalWorkouts } = await supabase.from('workout_sessions')
    .select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    
  // Fetch Total Sets
  const { count: totalSets } = await supabase.from('workout_sets')
    .select('id, workout_sessions!inner(user_id)', { count: 'exact', head: true })
    .eq('workout_sessions.user_id', user.id)
    .eq('completed', true)

  // Fetch Sessions for Heatmap (last 90 days)
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  const { data: sessionsData } = await supabase.from('workout_sessions')
    .select('date, completion_score')
    .eq('user_id', user.id)
    .gte('date', ninetyDaysAgo.toISOString().split('T')[0])
    
  const sessions = sessionsData?.map(s => ({
    date: s.date,
    completed: s.completion_score >= 50
  })) || []

  // Workout of the Day Data
  const rest = isRestDay()
  const todayName = getTodayDay()
  const todayExercises = EXERCISES.filter(e => e.day === todayName)
  
  // Derive focus and muscles
  let focus = 'Rest & Recovery'
  const muscles = new Set<string>()
  let estimatedMinutes = 0

  if (!rest && todayExercises.length > 0) {
    focus = 'Strength & Hypertrophy'
    todayExercises.forEach(e => {
      muscles.add(e.muscleGroup)
      estimatedMinutes += e.sets * 1.5 // Rough estimate per set
    })
    estimatedMinutes += 10 // warmup/cooldown
  }

  const { current: currentLevel } = getLevelFromXP(profile?.xp_total || 0)

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader name={profile?.name || 'Athlete'} />
      
      <TodayWorkoutCard 
        workoutName={rest ? 'Rest Day' : `${todayName.charAt(0).toUpperCase() + todayName.slice(1)} Workout`}
        focus={focus}
        muscles={Array.from(muscles)}
        estimatedMinutes={Math.round(estimatedMinutes)}
        isRestDay={rest}
      />
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StreakCounter 
          currentStreak={streak?.current_streak || 0} 
          bestStreak={streak?.best_streak || 0} 
        />
        <div className="flex flex-col items-center justify-center p-4 bg-zinc-900 rounded-lg border border-zinc-800">
           <span className="text-3xl font-bold text-white mb-1">Lvl {currentLevel.level}</span>
           <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{currentLevel.name}</span>
           <span className="text-[10px] text-zinc-600 mt-2">{profile?.xp_total || 0} XP</span>
        </div>
      </div>
      
      <StartWorkoutButton />
      
      <WorkoutHeatmap sessions={sessions} />
      
      <QuickStats 
        totalWorkouts={totalWorkouts || 0} 
        totalSets={totalSets || 0} 
        bestStreak={streak?.best_streak || 0} 
      />
    </div>
  )
}
