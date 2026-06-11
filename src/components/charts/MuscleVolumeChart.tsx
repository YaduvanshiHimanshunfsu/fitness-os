'use client'
import { motion } from 'framer-motion'
import { staggerChildren } from '@/lib/animations'
import type { MuscleVolumeData } from '@/services/analytics-service'
import type { Period } from '@/components/analytics/PeriodTabs'

export function MuscleVolumeChart({ data, period }: { data: MuscleVolumeData[], period: Period }) {
  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center min-h-[200px]">
        <p className="text-zinc-500 text-sm">No muscle volume data for this {period}.</p>
      </div>
    )
  }

  return (
    <motion.div 
      variants={staggerChildren} 
      initial="initial" 
      animate="animate" 
      className="flex flex-col gap-4 mt-2"
    >
      {data.map((item, index) => {
        // Opacity scaling from 1.0 down to 0.4 based on position
        const opacity = Math.max(0.4, 1 - (index * 0.15))
        
        return (
          <div key={item.muscleGroup} className="w-full">
            <div className="flex justify-between items-end mb-1.5">
              <div>
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 capitalize">{item.muscleGroup}</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-600 ml-2">{item.sets} sets</span>
              </div>
              <span className="text-xs font-bold text-zinc-500">{item.percentage}%</span>
            </div>
            
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 50, 
                  damping: 15, 
                  delay: index * 0.08 
                }}
                className="h-full rounded-full"
                style={{ 
                  backgroundColor: `rgba(212, 212, 216, ${opacity})` // zinc-300 with calculated opacity
                }}
              />
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
