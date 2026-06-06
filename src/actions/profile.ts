'use server'

import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updates = {
    full_name: formData.get('full_name') as string,
    updated_at: new Date().toISOString(),
  }

  const { error } = await (supabase
    .from('profiles') as any)
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
