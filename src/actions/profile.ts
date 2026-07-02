'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Not authenticated' }

  const name = (formData.get('name') as string)?.trim()
  if (!name) return { error: 'Name cannot be empty' }

  const { error } = await supabase.from('profiles')
    .update({ name })
    .eq('id', user.id)

  if (error) return { error: error.message }

  // Revalidate the dashboard so the welcome header refreshes
  revalidatePath('/dashboard')
  revalidatePath('/profile')

  return { success: true }
}
