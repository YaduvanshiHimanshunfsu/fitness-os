'use client'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'

export function PageHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <motion.div 
      variants={fadeUp} 
      initial="initial" 
      animate="animate" 
      className="pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-8"
    >
      <h1 className="text-2xl font-bold tracking-widest uppercase text-zinc-900 dark:text-white mb-2">{title}</h1>
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{subtitle}</p>
    </motion.div>
  )
}
