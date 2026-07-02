import { createClient } from '@/lib/supabase/server'
import { LEVELS } from '@/constants/levels'
import { ACHIEVEMENTS } from '@/constants/achievements'

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

  const { data } = await (supabase
    .from('user_achievements') as any)
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId)

  return data ?? []
}

export async function getLevelInfo(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await (supabase
    .from('profiles') as any)
    .select('xp_total')
    .eq('id', userId)
    .single()

  const xp = profile?.xp_total ?? 0
  
  let currentLevel = LEVELS[0]
  let nextLevel = LEVELS[1]

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) {
      currentLevel = LEVELS[i]
      nextLevel = LEVELS[i + 1] ?? LEVELS[i] // If max level, next = current
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

  const { count: totalWorkouts } = await (supabase
    .from('workouts_v5') as any)
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId)

  const { data: workoutsWithSets } = await (supabase
    .from('workouts_v5') as any)
    .select('workout_exercises_v5(workout_sets_v5(completed))')
    .eq('profile_id', userId)

  let totalSetsCompleted = 0
  for (const w of (workoutsWithSets as any[]) ?? []) {
    for (const we of w.workout_exercises_v5 || []) {
      totalSetsCompleted += (we.workout_sets_v5 || []).filter((s: any) => s.completed).length
    }
  }

  const { data: streakRow } = await (supabase
    .from('streaks') as any)
    .select('current_streak')
    .eq('user_id', userId)
    .single()

  const currentStreak = streakRow?.current_streak ?? 0

  const { data: allAchievements } = await (supabase
    .from('achievements') as any)
    .select('id, condition_type, condition_value')

  if (!allAchievements) return

  const { data: alreadyUnlocked } = await (supabase
    .from('user_achievements') as any)
    .select('achievement_id')
    .eq('user_id', userId)

  const unlockedIds = new Set((alreadyUnlocked ?? []).map((a: any) => a.achievement_id))

  for (const achievement of allAchievements as any[]) {
    if (unlockedIds.has(achievement.id)) continue

    let qualifies = false

    switch (achievement.condition_type) {
      case 'total_workouts':
        qualifies = (totalWorkouts ?? 0) >= achievement.condition_value
        break
      case 'total_sets':
        qualifies = totalSetsCompleted >= achievement.condition_value
        break
      case 'streak':
        qualifies = currentStreak >= achievement.condition_value
        break
      default:
        break
    }

    if (qualifies) {
      await (supabase.from('user_achievements') as any).insert({
        user_id: userId,
        achievement_id: achievement.id,
      })
    }
  }
}
