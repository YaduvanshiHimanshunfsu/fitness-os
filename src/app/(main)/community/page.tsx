import { createClient } from '@/lib/supabase/server'
import { Trophy, Medal, Crown, Zap } from 'lucide-react'
import { getLevelFromXP } from '@/utils/level-calculator'
import ClientCommunityFeed from '@/components/community/ClientCommunityFeed'

export const revalidate = 0

export default async function CommunityLeaderboard() {
  const supabase = await createClient()

  // XP Leaderboard + Activity Feed in parallel
  const [{ data: profiles, error }, { data: feedData }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, avatar_url, xp_total')
      .order('xp_total', { ascending: false })
      .limit(100),
    (supabase as any)
      .from('activity_feed')
      .select('id, user_name, action_type, data, created_at')
      .order('created_at', { ascending: false })
      .limit(30),
  ])

  const leaderboard = error ? [] : (profiles ?? [])
  const initialFeed = feedData ?? []

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white uppercase flex items-center gap-3">
          <Trophy className="w-8 h-8 text-[#FF4500]" />
          Community
        </h1>
        <p className="text-zinc-500 max-w-2xl">
          Live activity from the squad — XP earned, workouts crushed, and records broken.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Activity Feed (Realtime) — 3/5 width */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
            Live Feed
          </h2>
          <ClientCommunityFeed initialFeed={initialFeed} />
        </div>

        {/* XP Leaderboard — 2/5 width */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FF4500]" />
            XP Rankings
          </h2>
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-zinc-200 dark:border-[#1F1F1F] shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-200 dark:divide-[#1F1F1F]">
              {leaderboard.map((profile, index) => {
                const rank = index + 1
                const levelInfo = getLevelFromXP(profile.xp_total ?? 0)
                const levelName = levelInfo?.current?.name ?? 'Beginner'
                return (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-[#111111] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-sm font-bold w-6 text-center ${rank <= 3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF4500] to-[#FF8C00]' : 'text-zinc-500'}`}>
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        {profile.avatar_url
                          ? <img src={profile.avatar_url} alt={profile.name ?? ''} className="w-full h-full object-cover" />
                          : profile.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white text-sm">{profile.name}</div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{levelName}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#FF4500] text-sm">
                      {(profile.xp_total ?? 0).toLocaleString()} XP
                    </span>
                  </div>
                )
              })}
              {leaderboard.length === 0 && (
                <div className="px-6 py-12 text-center text-zinc-500">No athletes yet.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
