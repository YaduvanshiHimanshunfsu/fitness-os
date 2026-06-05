'use client'
import { motion } from 'framer-motion'

export type Period = 'week' | 'month' | 'year'

export function PeriodTabs({
  period,
  onChange
}: {
  period: Period
  onChange: (p: Period) => void
}) {
  const tabs: { id: Period; label: string }[] = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
  ]

  return (
    <div className="flex border-b border-zinc-800 mb-6">
      {tabs.map((tab) => {
        const isActive = period === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-6 py-4 text-sm font-bold tracking-widest uppercase transition-colors ${
              isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-300"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
