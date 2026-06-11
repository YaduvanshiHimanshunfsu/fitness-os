'use client'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import type { Achievement } from '@/constants/achievements'

export function AchievementCard({ 
  achievement, 
  unlockedAt 
}: { 
  achievement: Achievement
  unlockedAt: string | null 
}) {
  const isUnlocked = unlockedAt !== null

  return (
    <motion.div 
      variants={fadeUp}
      className={`relative border rounded-xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 ${
        isUnlocked 
          ? 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/5' 
          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-900 opacity-60 grayscale'
      }`}
    >
      {isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/10 to-transparent rounded-xl pointer-events-none" />
      )}
      
      <div className="text-4xl mb-3">{achievement.icon}</div>
      <h3 className={`text-sm font-bold tracking-widest uppercase mb-1 ${isUnlocked ? 'text-zinc-800 dark:text-zinc-100' : 'text-zinc-500'}`}>
        {achievement.name}
      </h3>
      <p className="text-xs font-medium text-zinc-500 mb-4">{achievement.description}</p>
      
      <div className="mt-auto">
        {isUnlocked ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold tracking-widest uppercase border border-zinc-300 dark:border-zinc-700">
            {new Date(unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-950 text-zinc-700 text-[10px] font-bold tracking-widest uppercase border border-zinc-200 dark:border-zinc-800">
            Locked
          </span>
        )}
      </div>
    </motion.div>
  )
}
