'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { getStreakRing } from '@/types/analytics'

export function StreakCard({
  currentStreak,
  bestStreak,
  lastWorkoutDate
}: {
  currentStreak: number
  bestStreak: number
  lastWorkoutDate: string | null
}) {
  const [offset, setOffset] = useState(0)
  const ring = getStreakRing(currentStreak)
  
  const radius = 56
  const circumference = 2 * Math.PI * radius
  
  useEffect(() => {
    // Delay animation slightly for effect
    const timeout = setTimeout(() => {
      const progress = circumference - (ring.progressPercent / 100) * circumference
      setOffset(progress)
    }, 100)
    return () => clearTimeout(timeout)
  }, [ring.progressPercent, circumference])

  let iconColor = 'text-zinc-500'
  if (currentStreak >= 7) iconColor = 'text-amber-400'
  if (currentStreak >= 30) iconColor = 'text-orange-500'

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Background glow if streak is active */}
      {currentStreak > 0 && (
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
      )}

      <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6 w-full text-left">Streak Tracker</h3>

      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r={radius} className="stroke-zinc-800 fill-none" strokeWidth="6" />
          <circle 
            cx="64" 
            cy="64" 
            r={radius} 
            className="stroke-zinc-300 fill-none transition-all duration-1000 ease-out" 
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset === 0 ? circumference : offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
          <span className="text-3xl font-bold text-zinc-900 dark:text-white leading-none">{currentStreak}</span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mt-1">Days</span>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center mb-2">
        <Flame className={`w-5 h-5 ${iconColor}`} />
        <span className="text-xl font-bold text-zinc-900 dark:text-white">{currentStreak} days</span>
      </div>
      
      <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mb-1">
        Best: {bestStreak} days
      </p>
      
      <p className="text-xs text-zinc-600 font-medium mb-6">
        Last workout: {lastWorkoutDate ? new Date(lastWorkoutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never'}
      </p>

      {currentStreak === 0 ? (
        <div className="mt-auto inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-widest border border-amber-500/20">
          Start your streak today
        </div>
      ) : (
        <div className="mt-auto flex flex-col gap-1 w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] tracking-widest uppercase font-bold text-zinc-500">Next Milestone</span>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {ring.milestoneName} <span className="text-zinc-600">({ring.remaining} to go)</span>
          </span>
        </div>
      )}
    </div>
  )
}
