'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { staggerChildren, fadeUp } from '@/lib/animations'
import { Dumbbell, BarChart3, Repeat, Flame } from 'lucide-react'

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(ease * target))

      if (progress < 1) {
        animId = requestAnimationFrame(step)
      }
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [target, duration])

  return count
}

export function LifetimeStatsRow({
  totalWorkouts,
  totalSets,
  totalReps,
  bestStreak
}: {
  totalWorkouts: number
  totalSets: number
  totalReps: number
  bestStreak: number
}) {
  return (
    <motion.div 
      variants={staggerChildren} 
      initial="initial" 
      animate="animate" 
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      <StatCard icon={<Dumbbell className="w-5 h-5" />} label="Total Workouts" value={totalWorkouts} />
      <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Total Sets" value={totalSets} />
      <StatCard icon={<Repeat className="w-5 h-5" />} label="Total Reps" value={totalReps} />
      <StatCard icon={<Flame className="w-5 h-5 text-amber-500" />} label="Best Streak" value={bestStreak} suffix=" days" />
    </motion.div>
  )
}

function StatCard({ icon, label, value, suffix = '' }: { icon: React.ReactNode, label: string, value: number, suffix?: string }) {
  const animatedValue = useCountUp(value)

  return (
    <motion.div 
      variants={fadeUp} 
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-zinc-600 group"
    >
      <div className="mb-3 text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-300 transition-colors">
        {icon}
      </div>
      <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2 text-center">{label}</span>
      <span className="text-3xl font-bold text-zinc-900 dark:text-white">
        {animatedValue}{suffix && <span className="text-sm text-zinc-500 font-medium ml-1">{suffix}</span>}
      </span>
    </motion.div>
  )
}
