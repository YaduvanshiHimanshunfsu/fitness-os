'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveGlobalSettings(settings: { geminiApiKey?: string, userRegistrationLimit?: number }) {
  const supabase = await createClient()
  
  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await (supabase.from('profiles') as any)
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.email !== 'himanshu98075@gmail.com') {
    throw new Error('Forbidden')
  }

  // Update Gemini API Key
  if (settings.geminiApiKey !== undefined) {
    const { error } = await (supabase.from('app_settings') as any).upsert({
      key: 'gemini_api_key',
      value: JSON.stringify(settings.geminiApiKey)
    }, { onConflict: 'key' })
    if (error) throw error
  }

  // Update Registration Limit
  if (settings.userRegistrationLimit !== undefined) {
    const { error } = await (supabase.from('app_settings') as any).upsert({
      key: 'user_registration_limit',
      value: JSON.stringify(settings.userRegistrationLimit)
    }, { onConflict: 'key' })
    if (error) throw error
  }

  // Log action
  await (supabase.from('admin_logs') as any).insert({
    admin_id: user.id,
    action: 'updated_settings',
    details: JSON.stringify(settings)
  })

  revalidatePath('/admin')
  return { success: true }
}
