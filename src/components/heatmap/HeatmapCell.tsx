import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function HeatmapCell({ 
  date, 
  completed, 
  isRestDay, 
  isFuture, 
  isToday,
  sets
}: { 
  date: string
  completed: boolean
  isRestDay: boolean
  isFuture: boolean
  isToday: boolean 
  sets: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  let bgClass = 'bg-zinc-200 dark:bg-zinc-800'
  
  if (isFuture) {
    bgClass = 'bg-transparent border border-zinc-200 dark:border-zinc-800'
  } else if (completed) {
    // Increase intensity based on volume (example: >15 sets is brightest)
    if (sets >= 15) bgClass = 'bg-teal-400'
    else if (sets >= 10) bgClass = 'bg-teal-500/80'
    else if (sets >= 5) bgClass = 'bg-teal-600/60'
    else bgClass = 'bg-teal-800/40'
  } else if (isRestDay) {
    bgClass = 'bg-white dark:bg-zinc-900 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,255,255,0.04)_3px,rgba(255,255,255,0.04)_4px)]'
  }
  
  let ringClass = ''
  if (isToday) ringClass = 'ring-1 ring-zinc-400 ring-offset-1 ring-offset-zinc-900 z-10 relative'

  const dateObj = new Date(date)
  const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div 
      className="relative group"
      onMouseEnter={() => !isFuture && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-3 h-3 md:w-6 md:h-6 rounded-[2px] transition-colors hover:ring-1 hover:ring-zinc-500 cursor-pointer ${bgClass} ${ringClass}`}
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-[#18181B] border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-[10px] md:text-xs font-bold px-3 py-2 rounded-lg shadow-xl z-50 pointer-events-none"
          >
            <div className="text-zinc-600 dark:text-zinc-400 mb-1">{displayDate}</div>
            <div>
              {completed ? `${sets} Sets Completed` : isRestDay ? 'Rest Day' : 'Missed Workout'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
