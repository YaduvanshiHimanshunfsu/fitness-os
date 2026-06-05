'use client'
import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'

export function StreakCounter({ currentStreak, bestStreak }: { currentStreak: number, bestStreak: number }) {
  const [displayStreak, setDisplayStreak] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const duration = 800
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setDisplayStreak(Math.floor(progress * currentStreak))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [currentStreak])

  let iconColor = 'text-zinc-500'
  if (currentStreak >= 7) iconColor = 'text-amber-400'
  if (currentStreak >= 30) iconColor = 'text-orange-500'

  return (
    <div className="flex flex-col items-center p-4 bg-zinc-900 rounded-lg border border-zinc-800">
      <div className="flex items-center gap-2 mb-1">
        <Flame className={`w-6 h-6 ${iconColor}`} />
        <span className="text-3xl font-bold text-white">{displayStreak}</span>
      </div>
      <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Day Streak</span>
      <span className="text-[10px] text-zinc-600 mt-2">Best: {bestStreak}</span>
    </div>
  )
}
