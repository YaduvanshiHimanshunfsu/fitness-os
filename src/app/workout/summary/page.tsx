'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerChildren, slideRight } from '@/lib/animations'
import { useWorkoutStore } from '@/hooks/useWorkout'
import { saveWorkoutSession } from '@/actions/workout'
import { EXERCISES } from '@/constants/exercises'
import { ACHIEVEMENTS } from '@/constants/achievements'
import { Loader2 } from 'lucide-react'

// Inject Confetti CDN Script
function loadConfetti() {
  if (typeof window !== 'undefined' && !(window as any).confetti) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js'
    script.async = true
    document.body.appendChild(script)
  }
}

export default function SummaryPage() {
  const router = useRouter()
  const { day, startTime, completedSets, reset } = useWorkoutStore()
  
  const [isSaving, setIsSaving] = useState(true)
  const [saveResult, setSaveResult] = useState<{
    xpEarned: number
    unlockedAchievementIds: number[]
    newStreak: number
  } | null>(null)

  useEffect(() => {
    loadConfetti()
    
    // Save to DB on mount
    const handleSave = async () => {
      try {
        const endTime = new Date()
        // Calculate score
        const todayExercises = EXERCISES.filter(ex => ex.day === day)
        const totalTargetSets = todayExercises.reduce((acc, ex) => acc + ex.sets, 0)
        const completedCount = completedSets.length
        
        const score = totalTargetSets === 0 ? 100 : Math.min(100, Math.round((completedCount / totalTargetSets) * 100))

        const result = await saveWorkoutSession({
          day: day || 'unknown',
          startTime: startTime || new Date(Date.now() - 3600000), // fallback 1 hour ago
          endTime,
          completedSets,
          completionScore: score
        })
        
        setSaveResult(result)
        setIsSaving(false)

        if (score >= 90 && (window as any).confetti) {
          (window as any).confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#a1a1aa', '#d4d4d8', '#ffffff']
          })
        }
      } catch (e) {
        console.error('Failed to save workout', e)
        setIsSaving(false)
        // In a real app, handle error gracefully
      }
    }
    
    if (isSaving) handleSave()
  }, [day, startTime, completedSets, isSaving])

  const handleFinish = () => {
    reset()
    router.push('/dashboard')
  }

  if (isSaving) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin mb-4" />
        <p className="text-zinc-400 tracking-widest uppercase text-sm">Saving Session...</p>
      </div>
    )
  }

  // Calculate duration
  const duration = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 60000) : 0
  const score = saveResult?.xpEarned ? 100 : Math.round((completedSets.length / 20) * 100) // mock total sets

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-6 justify-center">
        <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Step 6 of 6
        </div>
      </div>

      <motion.div variants={fadeUp} initial="initial" animate="animate" className="text-center mb-10 mt-4">
        <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 text-white">We Did It! 🎉</h1>
        <p className="text-zinc-400 font-medium tracking-wide">
          {day.charAt(0).toUpperCase() + day.slice(1)} Workout Complete
        </p>
      </motion.div>

      <motion.div variants={staggerChildren} initial="initial" animate="animate" className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="⏱ Duration" value={`${duration} min`} delay={0} />
        <StatCard label="💪 Sets" value={`${completedSets.length}`} delay={0.1} />
        <StatCard label="📊 Completion" value={`${score}%`} delay={0.2} />
        <StatCard label="⭐ XP Earned" value={`+${saveResult?.xpEarned || 50} XP`} delay={0.3} />
      </motion.div>

      <motion.div 
        variants={slideRight} 
        initial="initial" 
        animate="animate" 
        transition={{ delay: 0.6 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-8 flex justify-between items-center"
      >
        <div>
          <p className="text-xs tracking-widest uppercase text-zinc-500 font-bold mb-1">Current Streak</p>
          <p className="text-2xl font-bold text-white flex items-center gap-2">
            🔥 {saveResult?.newStreak || 1} Days
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Keep it up!</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {saveResult?.unlockedAchievementIds && saveResult.unlockedAchievementIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="mb-8 border border-amber-500/50 bg-amber-500/10 rounded-xl p-4 text-center"
          >
            <p className="text-xs tracking-widest uppercase text-amber-500 font-bold mb-3">Achievement Unlocked</p>
            {saveResult.unlockedAchievementIds.map(id => {
              const ach = ACHIEVEMENTS.find(a => a.id === id)
              return ach ? (
                <div key={id} className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{ach.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-amber-100">{ach.name}</p>
                    <p className="text-xs text-amber-500/80">{ach.description}</p>
                  </div>
                </div>
              ) : null
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4 mt-auto relative">
        {/* Pulse animation for the ring */}
        <div className="absolute inset-x-0 bottom-0 h-14 rounded-xl border border-zinc-500 pointer-events-none animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <button 
          onClick={handleFinish}
          className="w-full h-14 bg-zinc-800 border-zinc-600 text-zinc-100 rounded-xl text-sm tracking-widest uppercase font-bold hover:scale-[1.02] hover:border-zinc-400 hover:bg-zinc-700 transition-all shadow-lg shadow-black/50 relative z-10"
        >
          Back to Dashboard →
        </button>
      </div>
    </div>
  )
}

function StatCard({ label, value, delay }: { label: string, value: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center"
    >
      <span className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">{label}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
    </motion.div>
  )
}
