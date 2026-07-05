'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'

const SettingsSchema = z.object({
  geminiApiKey: z.string().optional(),
  userRegistrationLimit: z.number().int().nonnegative().optional(),
  useDbMartialArts: z.boolean().optional(),
  useDbMuscleFocus: z.boolean().optional(),
})

export async function saveGlobalSettings(rawSettings: z.infer<typeof SettingsSchema>) {
  const settings = SettingsSchema.parse(rawSettings)
  const supabase = await createClient()
  
  // Verify user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase.from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden')
  }

  // We no longer save Gemini API Key to the database. Use Vercel Environment Variables.

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

  // Sanitize settings before logging
  const safeSettings = { ...settings }
  delete safeSettings.geminiApiKey

  // Log action
  await supabase.from('admin_logs').insert({
    admin_id: user.id,
    action: 'updated_settings',
    details: JSON.stringify(safeSettings)
  })

  revalidatePath('/admin')
    revalidateTag('settings')
  return { success: true }
}
