'use client'
import { motion } from 'framer-motion'
import type { Level } from '@/constants/levels'

export function LevelProgress({ 
  xp, 
  currentLevel, 
  nextLevel, 
  progressPercent, 
  xpNeeded 
}: { 
  xp: number
  currentLevel: Level
  nextLevel: Level
  progressPercent: number
  xpNeeded: number
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 md:p-8 mb-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-200 dark:bg-zinc-800/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 block mb-2">Current Level</span>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Level {currentLevel.level} — <span className="text-zinc-600 dark:text-zinc-400">{currentLevel.name}</span>
          </h2>
        </div>
        <div className="text-left md:text-right">
          <span className="text-2xl font-bold text-zinc-700 dark:text-zinc-300">{xp} <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">XP</span></span>
          {xpNeeded > 0 && (
            <p className="text-xs font-medium text-zinc-500 mt-1">{xpNeeded} XP to Level {nextLevel.level}</p>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full h-4 bg-zinc-50 dark:bg-zinc-950 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-zinc-300 rounded-full"
        />
      </div>
    </div>
  )
}
