'use client'
import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { fadeUp } from '@/lib/animations'

export function CheckboxRow({ 
  label, 
  detail, 
  checked, 
  onToggle 
}: { 
  label: string
  detail: string
  checked: boolean
  onToggle: () => void 
}) {
  return (
    <motion.div 
      variants={fadeUp}
      layout
      className={`flex items-center justify-between p-4 mb-2 rounded-lg border transition-colors duration-300 ${
        checked ? 'bg-zinc-200 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center pointer-events-none">
           <Checkbox checked={checked} />
        </div>
        <span className={`text-[15px] font-medium transition-colors ${checked ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-800 dark:text-zinc-100'}`}>
          {label}
        </span>
      </div>
      <span className="text-[13px] text-zinc-500 font-medium">
        {detail}
      </span>
    </motion.div>
  )
}
