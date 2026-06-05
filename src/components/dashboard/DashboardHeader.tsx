'use client'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import { formatWorkoutDate, getTodayDay, isRestDay } from '@/utils/date-utils'

export function DashboardHeader({ name }: { name: string }) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const restDay = isRestDay()

  return (
    <motion.header
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="mb-8"
    >
      <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
        {greeting}, {name}
      </h1>
      <p className="text-zinc-400 font-medium">
        {getTodayDay().charAt(0).toUpperCase() + getTodayDay().slice(1)} • {formatWorkoutDate(new Date())}
      </p>
      
      {restDay && (
        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium border border-amber-500/20">
          Rest Day — Recover & Recharge
        </div>
      )}
    </motion.header>
  )
}
