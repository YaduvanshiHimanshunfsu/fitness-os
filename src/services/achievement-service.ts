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

  const { data } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId)

  return data ?? []
}

export async function getLevelInfo(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp_total')
    .eq('id', userId)
    .single()

  const xp = profile?.xp_total ?? 0
  
  let currentLevel = LEVELS[0]
  let nextLevel = LEVELS[1]

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].threshold) {
      currentLevel = LEVELS[i]
      nextLevel = LEVELS[i + 1] ?? LEVELS[i] // If max level, next = current
    } else {
      break
    }
  }

  const xpIntoLevel = xp - currentLevel.threshold
  const levelXpRequirement = nextLevel.threshold - currentLevel.threshold
  const progressPercent = levelXpRequirement === 0 ? 100 : Math.min(100, Math.round((xpIntoLevel / levelXpRequirement) * 100))

  return {
    xp,
    currentLevel,
    nextLevel,
    progressPercent,
    xpNeeded: levelXpRequirement === 0 ? 0 : nextLevel.threshold - xp
  }
}

export async function checkAndUnlockAchievements(userId: string) {
  // Normally, this function would query the database to check if certain criteria are met
  // e.g., total workouts > 10, total sets > 100, etc., and insert into user_achievements
  // For the scope of this implementation, we will stub it out to be integrated with saveWorkoutSession.
  const supabase = await createClient()

  // Example: Check if they completed their first workout
  const { count } = await supabase.from('workout_sessions').select('*', { count: 'exact', head: true }).eq('user_id', userId)
  
  if (count && count >= 1) {
    await supabase.from('user_achievements').upsert({
      user_id: userId,
      achievement_id: 'first_workout'
    }, { onConflict: 'user_id, achievement_id' })
  }
}
