'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { staggerChildren, fadeUp } from '@/lib/animations'

export function SetTracker({ 
  totalSets, 
  completedSets, 
  onSetToggle 
}: { 
  totalSets: number
  completedSets: boolean[]
  onSetToggle: (i: number) => void 
}) {
  return (
    <motion.div variants={staggerChildren} initial="initial" animate="animate" className="flex flex-col gap-2">
      {Array.from({ length: totalSets }).map((_, i) => {
        const isCompleted = completedSets[i]
        
        return (
          <motion.button
            key={i}
            variants={fadeUp}
            onClick={() => onSetToggle(i)}
            className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
              isCompleted 
                ? 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700' 
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:border-zinc-700'
            }`}
          >
            <span className={`text-[15px] font-medium transition-colors ${
              isCompleted ? 'text-zinc-500' : 'text-zinc-800 dark:text-zinc-100'
            }`}>
              Set {i + 1}
            </span>
            
            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
              isCompleted ? 'bg-zinc-100 border-zinc-100 text-zinc-900' : 'border-zinc-600 bg-transparent'
            }`}>
              {isCompleted && (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </div>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
