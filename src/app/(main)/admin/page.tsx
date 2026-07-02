import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ClientAdminPage from './ClientAdminPage'
import { getCachedExercises, getCachedSettings } from '@/services/cache-service'
import { getTemplates } from '@/actions/templates'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  // Only allow admin role OR specific email
  if (profile?.role !== 'admin' && profile?.email !== 'himanshu.btmtcs4242906@nfsu.ac.in') {
    redirect('/dashboard')
  }

  // Fetch initial data for admin
  const exercises = await getCachedExercises()
  const settings = await getCachedSettings()
  const initialTemplates = await getTemplates()

  const { data: logs } = await supabase.from('admin_logs')
    .select('*, profiles(name, email)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-mono tracking-wider text-zinc-900 dark:text-white uppercase">
          Command Center
        </h1>
        <p className="text-sm text-zinc-500 font-mono tracking-widest uppercase mt-2">
          System Administration & Configuration
        </p>
      </div>

      <ClientAdminPage 
        initialExercises={exercises ?? []} 
        initialSettings={settings ?? []} 
        initialLogs={logs ?? []}
        initialTemplates={initialTemplates ?? []}
      />
    </div>
  )
}
