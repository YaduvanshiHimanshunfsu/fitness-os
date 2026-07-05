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

export async function addMartialArtsExercise(data: {
  name: string
  instruction?: string
  comment?: string
  image_url?: string
  default_sets?: string
  default_reps?: string
  default_rest_time?: string
}) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('martial_arts_exercises').insert({
      ...data,
      created_at: new Date().toISOString()
    })

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'add_martial_arts_exercise',
      details: JSON.stringify({ name: data.name })
    })

    revalidatePath('/admin')
    revalidatePath('/martial-arts')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding martial arts exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function updateMartialArtsExercise(id: number, data: {
  name: string
  instruction?: string
  comment?: string
  image_url?: string
  default_sets?: string
  default_reps?: string
  default_rest_time?: string
}) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('martial_arts_exercises')
      .update(data)
      .eq('id', id)

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'update_martial_arts_exercise',
      details: JSON.stringify({ id, name: data.name })
    })

    revalidatePath('/admin')
    revalidatePath('/martial-arts')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating martial arts exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteMartialArtsExercise(id: number) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('martial_arts_exercises')
      .update({ is_deleted: true })
      .eq('id', id)

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'delete_martial_arts_exercise',
      details: JSON.stringify({ id })
    })

    revalidatePath('/admin')
    revalidatePath('/martial-arts')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting martial arts exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function getMartialArtsExercises() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('martial_arts_exercises')
      .select('*')
      .eq('is_deleted', false)
      .order('id', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching martial arts exercises:', error)
    return []
  }
}
export async function getMartialArtsTemplates() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('martial_arts_templates')
      .select(`
        id, day, title, description,
        martial_arts_template_exercises (
          id, sets, reps, exercise_order,
          martial_arts_exercises ( id, name, instruction, image_url )
        )
      `)
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching martial arts templates:', error)
    return []
  }
}
