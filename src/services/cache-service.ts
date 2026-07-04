import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// We create a static client without cookies so it can be cached indefinitely
// Next.js unstable_cache throws errors if you try to read cookies() inside it.
const getStaticClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const getCachedExercises = unstable_cache(
  async () => {
    const supabase = getStaticClient()
    const { data, error } = await supabase.from('exercises').select('*').eq('is_deleted', false).order('id')
    if (error) throw error
    return data
  },
  ['global-exercises'],
  { tags: ['exercises'], revalidate: 86400 } // Cache for 24 hours
)

export const getCachedSettings = unstable_cache(
  async () => {
    const supabase = getStaticClient()
    const { data, error } = await supabase.from('app_settings').select('*')
    if (error) throw error
    return data
  },
  ['global-settings'],
  { tags: ['settings'], revalidate: 86400 }
)
