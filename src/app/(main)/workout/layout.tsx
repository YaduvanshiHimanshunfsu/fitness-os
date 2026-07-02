'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { isRestDay } from '@/utils/date-utils'
import { useWorkoutStore } from '@/hooks/useWorkout'

export default function WorkoutLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { currentPhase } = useWorkoutStore()
  
  useEffect(() => {
    if (isRestDay() && pathname !== '/workout/rest') {
      router.replace('/dashboard')
    }
  }, [pathname, router])

  const totalSteps = 7
  let step = 1 // /workout (template page)
  if (pathname.includes('/warmup'))    step = 2
  else if (pathname.includes('/session'))   step = 3
  else if (pathname.includes('/posture'))   step = 4
  else if (pathname.includes('/knockknee')) step = 5
  else if (pathname.includes('/cooldown'))  step = 6
  else if (pathname.includes('/summary'))   step = 7

  const progressPercent = (step / totalSteps) * 100

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-zinc-800 dark:text-zinc-100 relative">
      <div className="fixed top-0 left-0 w-full h-1 bg-white dark:bg-zinc-900 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C61] shadow-[0_0_12px_rgba(255,107,53,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      <div className="flex-1 w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
