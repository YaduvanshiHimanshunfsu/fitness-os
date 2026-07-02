import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Trophy, Medal, Crown } from 'lucide-react'
import { getLevelFromXP } from '@/utils/level-calculator'
import Image from 'next/image'

export const revalidate = 60 // Revalidate leaderboard every 60 seconds

async function getLeaderboard() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url, xp_total')
    .order('xp_total', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
  return profiles
}

export default async function CommunityLeaderboard() {
  const leaderboard = await getLeaderboard()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white uppercase flex items-center gap-3">
          <Trophy className="w-8 h-8 text-[#FF4500]" />
          Community Leaderboard
        </h1>
        <p className="text-zinc-500 max-w-2xl">
          See how you rank against other athletes globally. Earning XP by completing workouts, hitting personal records, and maintaining streaks pushes you to the top.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-zinc-200 dark:border-[#1F1F1F] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-[#111111] border-b border-zinc-200 dark:border-[#1F1F1F]">
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Athlete</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden sm:table-cell">Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-[#1F1F1F]">
              {leaderboard.map((profile, index) => {
                const rank = index + 1
                const level = getLevelFromXP(profile.xp_total)
                let RankIcon = null
                
                if (rank === 1) RankIcon = <Crown className="w-5 h-5 text-yellow-500" />
                else if (rank === 2) RankIcon = <Medal className="w-5 h-5 text-zinc-400" />
                else if (rank === 3) RankIcon = <Medal className="w-5 h-5 text-amber-700" />

                return (
                  <tr 
                    key={profile.id}
                    className="hover:bg-zinc-50 dark:hover:bg-[#111111] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-lg font-bold ${rank <= 3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF4500] to-[#FF8C00]' : 'text-zinc-500'}`}>
                          #{rank}
                        </span>
                        {RankIcon}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-zinc-500 font-bold text-sm">
                              {profile.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {profile.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Level {level}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="font-mono font-bold text-[#FF4500]">
                        {profile.xp_total.toLocaleString()} XP
                      </span>
                    </td>
                  </tr>
                )
              })}
              
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    No athletes found on the leaderboard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
