'use client'
import { motion } from 'framer-motion'
import { staggerChildren, fadeUp } from '@/lib/animations'

export function QuickStats({ totalWorkouts, totalSets, bestStreak }: { totalWorkouts: number, totalSets: number, bestStreak: number }) {
  return (
    <motion.div 
      variants={staggerChildren}
      initial="initial"
      animate="animate"
      className="grid grid-cols-3 gap-3 mb-8"
    >
      <StatCard label="Workouts" value={totalWorkouts} />
      <StatCard label="Total Sets" value={totalSets} />
      <StatCard label="Best Streak" value={bestStreak} />
    </motion.div>
  )
}

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <motion.div variants={fadeUp} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center flex flex-col justify-center">
      <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">{label}</span>
      <span className="text-xl font-bold text-zinc-100">{value}</span>
    </motion.div>
  )
}
