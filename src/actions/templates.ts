'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'

import { verifyAdmin } from '@/lib/admin'

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
