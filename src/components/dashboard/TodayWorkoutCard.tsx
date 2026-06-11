'use client'
import { motion } from 'framer-motion'
import { scaleIn } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'

export function TodayWorkoutCard({ 
  workoutName, 
  focus, 
  muscles, 
  estimatedMinutes,
  isRestDay 
}: { 
  workoutName: string
  focus: string
  muscles: string[]
  estimatedMinutes: number
  isRestDay: boolean
}) {
  return (
    <motion.div variants={scaleIn} initial="initial" animate="animate" className="mb-6">
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
        {/* Subtle gradient background based on state */}
        <div className={`absolute inset-0 opacity-10 ${isRestDay ? 'bg-gradient-to-br from-amber-500 to-transparent' : 'bg-gradient-to-br from-zinc-400 to-transparent'}`} />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium text-sm mb-1 uppercase tracking-wider">{isRestDay ? 'Recovery Focus' : focus}</p>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{workoutName}</h2>
            </div>
            {!isRestDay && (
              <div className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700">
                ~{estimatedMinutes} min
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {muscles.map((m) => (
              <span key={m} className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-xs font-medium border border-zinc-300 dark:border-zinc-700 capitalize">
                {m}
              </span>
            ))}
          </div>

          {isRestDay && (
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm">
              Take a walk, do some light stretching, and let your muscles recover. You've earned it.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
