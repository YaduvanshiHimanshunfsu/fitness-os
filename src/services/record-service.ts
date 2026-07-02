import { createClient } from '@/lib/supabase/server'

export interface PersonalRecord {
  id: string
  exercise_name: string
  muscle_group: string
  max_weight: number | null
  max_reps: number | null
  longest_hold_seconds: number | null
  estimated_1rm: number | null
  achieved_at: string
}

export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  // Epley formula
  return weight * (1 + reps / 30);
}

export async function getPersonalRecords(userId: string): Promise<PersonalRecord[]> {
  const supabase = await createClient()

  // In the current schema, personal_records has:
  // id, user_id, exercise_id, max_weight, max_reps, longest_hold_seconds, achieved_at
  const { data } = await (supabase
    .from('personal_records') as any)
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

  return (data as any[]).map((record: any) => ({
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
  const { data: existing } = await (supabase
    .from('personal_records') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .single()

  let isNewRecord = false
  const current1RM = (weight !== null && reps > 0) ? calculate1RM(weight, reps) : null;

  // Determine new values (use existing values as baseline, or defaults for first record)
  const newMaxReps = Math.max(reps, existing?.max_reps ?? 0)
  const newMaxWeight = Math.max(weight ?? 0, existing?.max_weight ?? 0)
  const newLongestHold = Math.max(holdTime ?? 0, existing?.longest_hold_seconds ?? 0)
  const new1RM = Math.max(current1RM ?? 0, existing?.estimated_1rm ?? 0)

  // Check if any value improved
  if (!existing) {
    isNewRecord = true
  } else {
    if (newMaxReps > (existing.max_reps ?? 0)) isNewRecord = true
    if (newMaxWeight > (existing.max_weight ?? 0)) isNewRecord = true
    if (newLongestHold > (existing.longest_hold_seconds ?? 0)) isNewRecord = true
    if (new1RM > (existing.estimated_1rm ?? 0)) isNewRecord = true
  }

  if (isNewRecord) {
    // Use upsert to atomically handle both insert and update, avoiding race conditions
    const { error } = await (supabase.from('personal_records') as any).upsert({
      user_id:              userId,
      exercise_id:          exerciseId,
      max_reps:             newMaxReps,
      max_weight:           newMaxWeight,
      longest_hold_seconds: newLongestHold,
      estimated_1rm:        new1RM,
      achieved_at:          new Date().toISOString(),
      updated_at:           new Date().toISOString(),
    }, { onConflict: 'user_id,exercise_id' })

    if (error) {
      console.error('Personal record upsert error:', error)
      throw error
    }
  }

  return isNewRecord
}
