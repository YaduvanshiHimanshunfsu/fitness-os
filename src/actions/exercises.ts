'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await (supabase.from('profiles') as any)
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.email !== 'himanshu98075@gmail.com') {
    throw new Error('Forbidden: Admin access required')
  }
  return { supabase, user }
}

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

    const { error } = await (supabase.from('exercises') as any).insert({
      ...data,
      created_at: new Date().toISOString()
    })

    if (error) throw error

    await (supabase.from('admin_logs') as any).insert({
      admin_id: user.id,
      action: 'add_exercise',
      details: JSON.stringify({ name: data.name })
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard') // Also invalidate where exercises are listed
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

    const { error } = await (supabase.from('exercises') as any)
      .update(data)
      .eq('id', id)

    if (error) throw error

    await (supabase.from('admin_logs') as any).insert({
      admin_id: user.id,
      action: 'update_exercise',
      details: JSON.stringify({ id, name: data.name })
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating exercise:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteExercise(id: number) {
  try {
    const { supabase, user } = await verifyAdmin()

    const { error } = await (supabase.from('exercises') as any)
      .delete()
      .eq('id', id)

    if (error) throw error

    await (supabase.from('admin_logs') as any).insert({
      admin_id: user.id,
      action: 'delete_exercise',
      details: JSON.stringify({ id })
    })

    revalidatePath('/admin')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting exercise:', error)
    return { success: false, error: error.message }
  }
}
