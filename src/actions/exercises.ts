'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'

import { verifyAdmin } from '@/lib/admin'

export async function addExercise(data: {
  name: string
  muscle_group: string
  difficulty: string
  instructions?: string
  common_mistakes?: string
  image_url?: string
}) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('exercises').insert({
      ...data,
      created_at: new Date().toISOString()
    })

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'add_exercise',
      details: JSON.stringify({ name: data.name })
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidateTag('exercises', 'max')
    return { success: true }
  } catch (error: any) {
    console.error('Error adding exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function updateExercise(id: number, data: {
  name: string
  muscle_group: string
  difficulty: string
  instructions?: string
  common_mistakes?: string
  image_url?: string
}) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('exercises')
      .update(data)
      .eq('id', id)

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'update_exercise',
      details: JSON.stringify({ id, name: data.name })
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidateTag('exercises', 'max')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteExercise(id: number) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await supabase.from('exercises')
      .update({ is_deleted: true })
      .eq('id', id)

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'delete_exercise',
      details: JSON.stringify({ id })
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    revalidateTag('exercises', 'max')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting exercise:', error)
    return { success: false, error: error.message }
  }
}
