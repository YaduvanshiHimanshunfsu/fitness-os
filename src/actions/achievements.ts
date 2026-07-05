'use server'

import { checkAndUnlockAchievements as unlockLegacy } from '@/services/achievement-service'
import { createClient } from '@/lib/supabase/server'

export async function triggerAchievementCheck() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Call legacy check in case the trigger missed something
  await unlockLegacy(user.id)
}

export async function getAchievements() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('achievements')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return []
  }
}

export async function getUserAchievements(userId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user achievements:', error)
    return []
  }
}
