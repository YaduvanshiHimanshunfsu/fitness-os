'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'

export function RestScreen({
  durationSeconds = 15,
  setNumber,
  exerciseName,
  nextLabel,
  onComplete,
  onSkip
}: {
  durationSeconds?: number
  setNumber: number
  exerciseName: string
  nextLabel: string
  onComplete: () => void
  onSkip: () => void
}) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete()
      return
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft, onComplete])

  const circumference = 2 * Math.PI * 56
  const strokeDashoffset = circumference - (timeLeft / durationSeconds) * circumference

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-6"
    >
      <h2 className="text-3xl font-bold tracking-widest uppercase text-white mb-12">REST</h2>

      <div className="relative w-32 h-32 flex items-center justify-center mb-12">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r="56" className="stroke-zinc-800 fill-none" strokeWidth="8" />
          <circle 
            cx="64" 
            cy="64" 
            r="56" 
            className="stroke-zinc-400 fill-none transition-all duration-1000 ease-linear" 
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-4xl font-bold text-white">{timeLeft}</span>
      </div>

      <div className="text-center mb-16">
        <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-2 block">
          Next up:
        </span>
        <span className="text-xl font-bold text-white">
          {nextLabel}
        </span>
      </div>

      <button 
        onClick={onSkip}
        className="text-sm font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors"
      >
        SKIP →
      </button>
    </motion.div>
  )
}
