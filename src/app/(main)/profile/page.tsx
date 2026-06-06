import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/analytics/PageHeader'
import { updateProfile } from '@/actions/profile'
import { User, Activity, Dumbbell, Award } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await (supabase
    .from('profiles') as any)
    .select('*')
    .eq('id', user.id)
    .single()

  async function handleUpdateProfile(formData: FormData) {
    'use server'
    await updateProfile(formData)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 pb-24">
      <PageHeader title="Profile" subtitle="Manage your personal information" />

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
             {/* Using an icon instead of an image upload for MVP */}
            <User className="w-12 h-12 text-zinc-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{profile?.full_name || 'Fitness User'}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <form action={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Full Name
            </label>
            <input 
              type="text" 
              name="full_name" 
              id="full_name"
              defaultValue={profile?.full_name || ''}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
          
          <div className="pt-4">
            <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors">
              Save Profile
            </button>
          </div>
        </form>
      </div>

      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Quick Stats</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <Activity className="w-6 h-6 text-emerald-500 mb-2" />
          <span className="text-2xl font-bold text-white leading-none mb-1">{profile?.total_workouts || 0}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Workouts</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <Award className="w-6 h-6 text-amber-500 mb-2" />
          <span className="text-2xl font-bold text-white leading-none mb-1">{profile?.xp_total || 0}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total XP</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <Dumbbell className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-2xl font-bold text-white leading-none mb-1">{profile?.total_sets || 0}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Sets</span>
        </div>
      </div>
    </div>
  )
}
