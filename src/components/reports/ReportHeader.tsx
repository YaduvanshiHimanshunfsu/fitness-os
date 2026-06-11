'use client'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fadeUp, staggerChildren } from '@/lib/animations'

export function ReportHeader({ title, subtitle, backHref }: { title: string, subtitle: string, backHref: string }) {
  const router = useRouter()

  return (
    <motion.div 
      variants={staggerChildren} 
      initial="initial" 
      animate="animate" 
      className="pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-8 flex flex-col"
    >
      <motion.button 
        variants={fadeUp}
        onClick={() => router.push(backHref)}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 transition-colors w-fit mb-6 text-sm font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Reports
      </motion.button>

      <motion.h1 variants={fadeUp} className="text-2xl font-bold tracking-widest uppercase text-zinc-900 dark:text-white mb-2">
        {title}
      </motion.h1>
      <motion.p variants={fadeUp} className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {subtitle}
      </motion.p>
    </motion.div>
  )
}
