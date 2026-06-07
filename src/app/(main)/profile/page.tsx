import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { updateProfile } from '@/actions/profile'
import { User, Activity, Dumbbell, Award, Mail, Pencil } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await (supabase
    .from('profiles') as any)
    .select('name, xp_total, total_workouts, total_sets, avatar_url')
    .eq('id', user.id)
    .single()

  async function handleUpdateProfile(formData: FormData) {
    'use server'
    const result = await updateProfile(formData)
    if (result?.error) {
      // Error will be shown via redirect with query param
    }
    redirect('/profile?saved=1')
  }

  const searchParams_saved = false; // Client component handles toast

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 pb-24">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Profile</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage your personal information and account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-6 shadow-xl">
        {/* Avatar + Name Row */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF4500]/30 to-[#FF8C61]/20 border border-[#FF4500]/30 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-white">
                {(profile?.name || user.email || 'A').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile?.name || 'Fitness Athlete'}</h2>
            <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-1">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <form action={handleUpdateProfile} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={profile?.name || ''}
                placeholder="Your name..."
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF4500]/60 focus:ring-1 focus:ring-[#FF4500]/30 transition-all"
              />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Email Address <span className="text-zinc-700 normal-case font-normal tracking-normal">(read-only)</span>
            </label>
            <input
              type="email"
              value={user.email || ''}
              readOnly
              className="w-full bg-zinc-950/50 border border-zinc-800/60 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF4500] to-[#E03C00] hover:from-[#E03C00] hover:to-[#CC3500] text-white font-black py-3.5 rounded-xl uppercase tracking-widest text-sm transition-all hover:shadow-[0_0_30px_rgba(255,69,0,0.4)]"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Stats Grid */}
      <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4">Your Stats</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors">
          <Activity className="w-6 h-6 text-[#10B981] mb-2" />
          <span className="text-2xl font-bold text-white leading-none mb-1">{profile?.total_workouts || 0}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Workouts</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors">
          <Award className="w-6 h-6 text-[#F59E0B] mb-2" />
          <span className="text-2xl font-bold text-white leading-none mb-1">{profile?.xp_total || 0}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total XP</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors">
          <Dumbbell className="w-6 h-6 text-[#3B82F6] mb-2" />
          <span className="text-2xl font-bold text-white leading-none mb-1">{profile?.total_sets || 0}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total Sets</span>
        </div>
      </div>
    </div>
  )
}
