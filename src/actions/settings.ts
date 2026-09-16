'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { verifyAdmin } from '@/lib/admin'
import { z } from 'zod'

// Gemini API key is ONLY managed via Vercel Environment Variables (GEMINI_API_KEY).
// It is never stored in the database.
const SettingsSchema = z.object({
  userRegistrationLimit: z.number().int().nonnegative().optional(),
  useDbMartialArts:      z.boolean().optional(),
  useDbMuscleFocus:      z.boolean().optional(),
})

export async function saveGlobalSettings(rawSettings: z.infer<typeof SettingsSchema>) {
  const settings = SettingsSchema.parse(rawSettings)
  const { supabase, user } = await verifyAdmin()

  if (settings.userRegistrationLimit !== undefined) {
    const { error } = await supabase.from('app_settings').upsert({
      key:   'user_registration_limit',
      value: JSON.stringify(settings.userRegistrationLimit),
    }, { onConflict: 'key' })
    if (error) throw error
  }

  if (settings.useDbMartialArts !== undefined) {
    const { error } = await supabase.from('app_settings').upsert({
      key:   'use_db_martial_arts',
      value: settings.useDbMartialArts, // store as native jsonb boolean
    }, { onConflict: 'key' })
    if (error) throw error
  }

  if (settings.useDbMuscleFocus !== undefined) {
    const { error } = await supabase.from('app_settings').upsert({
      key:   'use_db_muscle_focus',
      value: settings.useDbMuscleFocus, // store as native jsonb boolean
    }, { onConflict: 'key' })
    if (error) throw error
  }

  await supabase.from('admin_logs').insert({
    admin_id: user.id,
    action:   'updated_settings',
    details:  JSON.stringify(settings),
  })

  revalidatePath('/admin')
  revalidatePath('/', 'layout') // Clear root cache too
  return { success: true }
}
