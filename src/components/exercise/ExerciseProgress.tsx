'use client'
import { motion } from 'framer-motion'

export function ExerciseProgress({ 
  completedSets, 
  totalSets, 
  exerciseName 
}: { 
  completedSets: number
  totalSets: number
  exerciseName: string
}) {
  const percent = totalSets === 0 ? 0 : (completedSets / totalSets) * 100

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-4 py-3 z-40">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 truncate pr-4">
            {exerciseName}
          </span>
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 shrink-0">
            {completedSets} / {totalSets} sets
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-zinc-100"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          />
        </div>
      </div>
    </div>
  )
}
