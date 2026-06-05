'use server'

import { checkAndUpdateRecords } from '@/services/record-service'
import { createClient } from '@/lib/supabase/server'

export async function updateRecordAction(exerciseId: string, reps: number, weight: number | null, holdTime: number | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  return await checkAndUpdateRecords(user.id, exerciseId, reps, weight, holdTime)
}
