import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/analytics/PageHeader'
import { getUserAchievements, getLevelInfo } from '@/services/achievement-service'
import { AchievementGrid } from '@/components/achievements/AchievementGrid'
import { LevelProgress } from '@/components/achievements/LevelProgress'
import { ACHIEVEMENTS } from '@/constants/achievements'

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [userAchievements, levelInfo] = await Promise.all([
    getUserAchievements(user.id),
    getLevelInfo(user.id)
  ])

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 pb-24">
      <PageHeader title="Achievements" subtitle="Your journey and milestones" />

      <LevelProgress 
        xp={levelInfo.xp}
        currentLevel={levelInfo.currentLevel}
        nextLevel={levelInfo.nextLevel}
        progressPercent={levelInfo.progressPercent}
        xpNeeded={levelInfo.xpNeeded}
      />

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500">Badge Collection</h3>
        <span className="text-xs font-bold bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full border border-zinc-700">
          {userAchievements.length} / {ACHIEVEMENTS.length}
        </span>
      </div>

      <AchievementGrid userAchievements={userAchievements} />
    </div>
  )
}
