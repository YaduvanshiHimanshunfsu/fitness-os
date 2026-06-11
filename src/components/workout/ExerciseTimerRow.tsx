'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import { Check } from 'lucide-react'

export function ExerciseTimerRow({
  name,
  durationSeconds,
  isRunning,
  onStart,
  onComplete
}: {
  name: string
  durationSeconds: number
  isRunning: boolean
  onStart: () => void
  onComplete: () => void
}) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isRunning || done) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setDone(true)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, done, onComplete])

  const circumference = 2 * Math.PI * 20
  const strokeDashoffset = circumference - (timeLeft / durationSeconds) * circumference

  return (
    <motion.div 
      variants={fadeUp}
      layout
      className={`flex items-center justify-between p-4 mb-2 rounded-lg border transition-colors duration-300 ${
        done ? 'bg-zinc-200 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
      }`}
    >
      <span className={`text-[15px] font-medium transition-colors ${done ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-800 dark:text-zinc-100'}`}>
        {name}
      </span>

      <div className="flex items-center">
        {done ? (
          <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-green-400">
            <Check className="w-5 h-5" />
          </div>
        ) : isRunning ? (
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" className="stroke-zinc-700 fill-none" strokeWidth="4" />
              <circle 
                cx="24" 
                cy="24" 
                r="20" 
                className="stroke-zinc-300 fill-none transition-all duration-1000 ease-linear" 
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <span className="absolute text-xs font-bold">{timeLeft}</span>
          </div>
        ) : (
          <button 
            onClick={onStart}
            className="px-4 py-2 text-xs font-bold tracking-widest uppercase bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md transition-colors"
          >
            Start
          </button>
        )}
      </div>
    </motion.div>
  )
}
