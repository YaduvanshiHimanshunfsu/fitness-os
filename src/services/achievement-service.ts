import { createClient } from '@/lib/supabase/server'
import { LEVELS } from '@/constants/levels'

export interface UserAchievement {
  achievement_id: string
  unlocked_at: string
}

export interface AchievementStats {
  unlockedCount: number
  totalCount: number
  nextMilestone: number
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId)
  return data ?? []
}

export async function getLevelInfo(userId: string) {
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles')
    .select('xp_total')
    .eq('id', userId)
    .single()

  const xp = profile?.xp_total ?? 0
  let currentLevel = LEVELS[0]!
  let nextLevel = LEVELS[1]!

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i]!.xpRequired) {
      currentLevel = LEVELS[i]!
      nextLevel = LEVELS[i + 1] ?? LEVELS[i]!
    } else {
      break
    }
  }

  const xpIntoLevel = xp - currentLevel.xpRequired
  const levelXpRequirement = nextLevel.xpRequired - currentLevel.xpRequired
  const progressPercent = levelXpRequirement === 0 ? 100 : Math.min(100, Math.round((xpIntoLevel / levelXpRequirement) * 100))

  return {
    xp,
    currentLevel,
    nextLevel,
    progressPercent,
    xpNeeded: levelXpRequirement === 0 ? 0 : nextLevel.xpRequired - xp
  }
}

export async function checkAndUnlockAchievements(userId: string) {
  const supabase = await createClient()

  // Batch all stat queries in parallel — fixes N+1 pattern
  const [
    { count: totalWorkouts },
    { data: workoutsWithSets },
    { data: streakRow },
    { data: allAchievements },
    { data: alreadyUnlocked },
  ] = await Promise.all([
    supabase.from('workouts_v5').select('*', { count: 'exact', head: true }).eq('profile_id', userId),
    (supabase as any)
      .from('workouts_v5')
      .select('workout_exercises_v5(workout_sets_v5(completed))')
      .eq('profile_id', userId),
    supabase.from('streaks').select('current_streak').eq('user_id', userId).single(),
    supabase.from('achievements').select('id, condition_type, condition_value'),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', userId),
  ])

  if (!allAchievements) return

  // Compute aggregates in memory
  let totalSetsCompleted = 0
  for (const w of (workoutsWithSets as any[]) ?? []) {
    for (const we of (w.workout_exercises_v5 as any[]) || []) {
      totalSetsCompleted += (we.workout_sets_v5 || []).filter((s: any) => s.completed).length
    }
  }

  const currentStreak = streakRow?.current_streak ?? 0
  const unlockedIds = new Set((alreadyUnlocked ?? []).map((a: any) => a.achievement_id))

  // Evaluate all conditions in one pass, collect new unlocks
  const newUnlocks: { user_id: string; achievement_id: string }[] = []
  for (const achievement of allAchievements as any[]) {
    if (unlockedIds.has(achievement.id)) continue
    let qualifies = false
    switch (achievement.condition_type) {
      case 'total_workouts': qualifies = (totalWorkouts ?? 0) >= achievement.condition_value; break
      case 'total_sets':     qualifies = totalSetsCompleted >= achievement.condition_value;    break
      case 'streak':         qualifies = currentStreak >= achievement.condition_value;         break
      default: break
    }
    if (qualifies) newUnlocks.push({ user_id: userId, achievement_id: achievement.id })
  }

  // Single batch insert instead of N sequential inserts
  if (newUnlocks.length > 0) {
    await supabase.from('user_achievements').insert(newUnlocks)
  }
}
