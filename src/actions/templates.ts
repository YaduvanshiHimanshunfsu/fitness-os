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
    .single()

  if (profile?.role !== 'admin' && profile?.email !== 'himanshu.btmtcs4242906@nfsu.ac.in') {
    throw new Error('Forbidden: Admin access required')
  }
  return { supabase, user }
}

export async function getTemplates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('workout_templates')
    .select(`
      id, day, name, focus,
      workout_template_exercises (
        id, sets, reps, exercise_order,
        exercises ( id, name, muscle_group, image_url )
      )
    `)
    .order('id', { ascending: true })

  if (error) {
    console.error("Error fetching templates:", error)
    return []
  }
  return data
}

export async function updateTemplateFocus(id: number, focus: string) {
  try {
    const { supabase, user } = await verifyAdmin()
    const { error } = await supabase.from('workout_templates').update({ focus }).eq('id', id)
    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/schedule')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function addTemplateExercise(templateId: number, exerciseId: number, sets: number, reps: string, order: number) {
  try {
    const { supabase, user } = await verifyAdmin()
    const { error } = await supabase.from('workout_template_exercises').insert({
      template_id: templateId,
      exercise_id: exerciseId,
      sets,
      reps,
      exercise_order: order
    })
    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/schedule')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateTemplateExercise(id: number, data: { sets?: number, reps?: string, exercise_order?: number }) {
  try {
    const { supabase, user } = await verifyAdmin()
    const { error } = await supabase.from('workout_template_exercises').update(data).eq('id', id)
    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/schedule')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteTemplateExercise(id: number) {
  try {
    const { supabase, user } = await verifyAdmin()
    const { error } = await supabase.from('workout_template_exercises').delete().eq('id', id)
    if (error) throw error
    revalidatePath('/admin')
    revalidatePath('/schedule')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
