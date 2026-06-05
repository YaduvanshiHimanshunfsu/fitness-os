'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trophy, X } from 'lucide-react'

// Note: In a real app, this would be hooked up to a Zustand store or React Context
// so that checking an achievement in an action could trigger this toast globally.
// For now, it's a ready-to-use component.

export function AchievementToast({ achievement, onClose }: { achievement: any, onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-8 md:right-8 z-50 bg-zinc-900 border border-zinc-700 shadow-2xl shadow-black/50 rounded-xl p-4 flex items-center gap-4 w-[340px]"
    >
      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-2xl border border-zinc-700 shrink-0">
        {achievement.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Trophy className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Achievement Unlocked</span>
        </div>
        <h4 className="text-sm font-bold text-white truncate">{achievement.name}</h4>
      </div>
      <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
