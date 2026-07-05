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

export async function addMuscleFocusExercise(data: {
  name: string
  instruction?: string
  comment?: string
  image_url?: string
}) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('muscle_focus_exercises').insert({
      ...data,
      created_at: new Date().toISOString()
    })

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'add_muscle_focus_exercise',
      details: JSON.stringify({ name: data.name })
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding muscle focus exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function updateMuscleFocusExercise(id: number, data: {
  name: string
  instruction?: string
  comment?: string
  image_url?: string
}) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('muscle_focus_exercises')
      .update(data)
      .eq('id', id)

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'update_muscle_focus_exercise',
      details: JSON.stringify({ id, name: data.name })
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating muscle focus exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteMuscleFocusExercise(id: number) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('muscle_focus_exercises')
      .update({ is_deleted: true })
      .eq('id', id)

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'delete_muscle_focus_exercise',
      details: JSON.stringify({ id })
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting muscle focus exercise:', error)
    return { success: false, error: error.message }
  }
}
export async function getMuscleFocusTemplates() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('muscle_focus_templates')
      .select(`
        id, category, title, description,
        muscle_focus_template_exercises (
          id, sets, reps, exercise_order,
          muscle_focus_exercises ( id, name, instruction, image_url )
        )
      `)
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching muscle focus templates:', error)
    return []
  }
}

export async function getMuscleFocusExercises() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('muscle_focus_exercises')
      .select('*')
      .eq('is_deleted', false)
      .order('id', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching muscle focus exercises:', error)
    return []
  }
}
