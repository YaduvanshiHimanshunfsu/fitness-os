'use server'

import { checkAndUnlockAchievements } from '@/services/achievement-service'
import { createClient } from '@/lib/supabase/server'

export async function triggerAchievementCheck() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await checkAndUnlockAchievements(user.id)
}
