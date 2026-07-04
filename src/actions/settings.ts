'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function saveGlobalSettings(settings: { geminiApiKey?: string, userRegistrationLimit?: number, useDbMartialArts?: boolean, useDbMuscleFocus?: boolean }) {
  const supabase = await createClient()
  
  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.email !== 'himanshu.btmtcs4242906@nfsu.ac.in') {
    throw new Error('Forbidden')
  }

  // Update Gemini API Key
  if (settings.geminiApiKey !== undefined) {
    const { error } = await supabase.from('app_settings').upsert({
      key: 'gemini_api_key',
      value: JSON.stringify(settings.geminiApiKey)
    }, { onConflict: 'key' })
    if (error) throw error
  }

  // Update Registration Limit
  if (settings.userRegistrationLimit !== undefined) {
    const { error } = await supabase.from('app_settings').upsert({
      key: 'user_registration_limit',
      value: JSON.stringify(settings.userRegistrationLimit)
    }, { onConflict: 'key' })
    if (error) throw error
  }

  // Update DB Toggles
  if (settings.useDbMartialArts !== undefined) {
    const { error } = await supabase.from('app_settings').upsert({
      key: 'use_db_martial_arts',
      value: JSON.stringify(settings.useDbMartialArts)
    }, { onConflict: 'key' })
    if (error) throw error
  }

  if (settings.useDbMuscleFocus !== undefined) {
    const { error } = await supabase.from('app_settings').upsert({
      key: 'use_db_muscle_focus',
      value: JSON.stringify(settings.useDbMuscleFocus)
    }, { onConflict: 'key' })
    if (error) throw error
  }

  // Log action
  await supabase.from('admin_logs').insert({
    admin_id: user.id,
    action: 'updated_settings',
    details: JSON.stringify(settings)
  })

  revalidatePath('/admin')
    revalidateTag('settings')
  return { success: true }
}
