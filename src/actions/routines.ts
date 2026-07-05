'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single() as { data: any }

  if (profile?.role !== 'admin' && profile?.email !== 'himanshu.btmtcs4242906@nfsu.ac.in') {
    throw new Error('Forbidden: Admin access required')
  }
  return { supabase, user }
}

export async function addRoutineExercise(data: {
  routine_category: string
  name: string
  duration_seconds?: number
  reps?: string
  sets?: number
  exercise_order: number
}) {
  try {
    const { supabase, user } = await verifyAdmin()

    // 1. Get or create the routine for this category
    let { data: routine } = await supabase.from('auxiliary_routines')
      .select('id')
      .eq('category', data.routine_category)
      .single()

    if (!routine) {
      const { data: newRoutine, error: createError } = await supabase.from('auxiliary_routines')
        .insert({ category: data.routine_category })
        .select('id')
        .single()
      
      if (createError) throw createError
      routine = newRoutine
    }

    // 2. Insert the exercise
    const { error } = await supabase.from('auxiliary_routine_exercises').insert({
      routine_id: routine.id,
      name: data.name,
      duration_seconds: data.duration_seconds,
      reps: data.reps,
      sets: data.sets,
      exercise_order: data.exercise_order,
      created_at: new Date().toISOString()
    })

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'add_routine_exercise',
      details: JSON.stringify({ category: data.routine_category, name: data.name })
    })

    revalidatePath('/admin')
    revalidatePath(`/workout/${data.routine_category}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error adding routine exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function updateRoutineExercise(id: number, data: {
  name: string
  duration_seconds?: number
  reps?: string
  sets?: number
  exercise_order?: number
}) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('auxiliary_routine_exercises')
      .update(data)
      .eq('id', id)

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'update_routine_exercise',
      details: JSON.stringify({ id, name: data.name })
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating routine exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteRoutineExercise(id: number) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('auxiliary_routine_exercises')
      .update({ is_deleted: true })
      .eq('id', id)

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'delete_routine_exercise',
      details: JSON.stringify({ id })
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting routine exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function getRoutineExercises(category: string) {
  try {
    const supabase = await createClient()
    
    // Get the routine
    const { data: routine, error: routineError } = await supabase.from('auxiliary_routines')
      .select('id, image_url')
      .eq('category', category)
      .single()

    if (routineError || !routine) return null

    const { data, error } = await supabase.from('auxiliary_routine_exercises')
      .select('*')
      .eq('routine_id', routine.id)
      .eq('is_deleted', false)
      .order('exercise_order', { ascending: true })

    if (error) throw error
    return { routine, exercises: data || [] }
  } catch (error) {
    console.error(`Error fetching ${category} routines:`, error)
    return null
  }
}

export async function getAllAuxiliaryRoutines() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('auxiliary_routines')
      .select(`
        id, category, image_url,
        auxiliary_routine_exercises (
          id, name, duration_seconds, reps, sets, exercise_order, is_deleted
        )
      `)
    if (error) throw error
    
    // filter out deleted exercises from the nested array
    return (data || []).map((r: any) => ({
      ...r,
      auxiliary_routine_exercises: r.auxiliary_routine_exercises
        .filter((e: any) => !e.is_deleted)
        .sort((a: any, b: any) => a.exercise_order - b.exercise_order)
    }))
  } catch (error) {
    console.error('Error fetching all auxiliary routines:', error)
    return []
  }
}
