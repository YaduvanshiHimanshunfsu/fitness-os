'use client'
import { motion } from 'framer-motion'
import { staggerChildren } from '@/lib/animations'
import { ACHIEVEMENTS } from '@/constants/achievements'
import { AchievementCard } from './AchievementCard'

interface UserAchievement {
  achievement_id: string
  unlocked_at: string
}

export function AchievementGrid({ userAchievements }: { userAchievements: UserAchievement[] }) {
  const unlockedMap = new Map(userAchievements.map(ua => [ua.achievement_id, ua.unlocked_at]))

  return (
    <motion.div 
      variants={staggerChildren}
      initial="initial"
      animate="animate"
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      {ACHIEVEMENTS.map(achievement => (
        <AchievementCard 
          key={achievement.id} 
          achievement={achievement} 
          unlockedAt={unlockedMap.get(String(achievement.id)) ?? null} 
        />
      ))}
    </motion.div>
  )
}
