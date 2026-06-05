import { createClient } from '@/lib/supabase/server'

export interface PersonalRecord {
  id: string
  exercise_name: string
  muscle_group: string
  max_weight: number | null
  max_reps: number | null
  longest_hold_seconds: number | null
  achieved_at: string
}

export async function getPersonalRecords(userId: string): Promise<PersonalRecord[]> {
  const supabase = await createClient()

  // In the current schema, personal_records has:
  // id, user_id, exercise_id, max_weight, max_reps, longest_hold_seconds, achieved_at
  const { data } = await supabase
    .from('personal_records')
    .select(`
      id,
      max_weight,
      max_reps,
      longest_hold_seconds,
      achieved_at,
      exercises (
        name,
        muscle_group
      )
    `)
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false })

  if (!data) return []

  return data.map(record => ({
    id: record.id,
    max_weight: record.max_weight,
    max_reps: record.max_reps,
    longest_hold_seconds: record.longest_hold_seconds,
    achieved_at: record.achieved_at,
    exercise_name: (record.exercises as any)?.name ?? 'Unknown',
    muscle_group: (record.exercises as any)?.muscle_group ?? 'unknown'
  }))
}

export async function checkAndUpdateRecords(userId: string, exerciseId: string, reps: number, weight: number | null, holdTime: number | null) {
  const supabase = await createClient()

  // Get current record
  const { data: existing } = await supabase
    .from('personal_records')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .single()

  let isNewRecord = false
  const updates: any = {
    user_id: userId,
    exercise_id: exerciseId,
    achieved_at: new Date().toISOString()
  }

  if (!existing) {
    isNewRecord = true
    updates.max_reps = reps
    updates.max_weight = weight
    updates.longest_hold_seconds = holdTime
  } else {
    updates.max_reps = existing.max_reps
    updates.max_weight = existing.max_weight
    updates.longest_hold_seconds = existing.longest_hold_seconds

    if (reps > (existing.max_reps ?? 0)) {
      updates.max_reps = reps
      isNewRecord = true
    }
    if (weight !== null && weight > (existing.max_weight ?? 0)) {
      updates.max_weight = weight
      isNewRecord = true
    }
    if (holdTime !== null && holdTime > (existing.longest_hold_seconds ?? 0)) {
      updates.longest_hold_seconds = holdTime
      isNewRecord = true
    }
  }

  if (isNewRecord) {
    if (existing) {
      await supabase.from('personal_records').update(updates).eq('id', existing.id)
    } else {
      await supabase.from('personal_records').insert(updates)
    }
  }

  return isNewRecord
}
