'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { WARMUP_EXERCISES, WARMUP_IMAGE } from '@/constants/warmup'
import { ExerciseTimerRow } from '@/components/workout/ExerciseTimerRow'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { staggerChildren } from '@/lib/animations'
import { useWorkoutStore } from '@/hooks/useWorkout'

export default function WarmUpPage() {
  const router = useRouter()
  const { setPhase } = useWorkoutStore()
  
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [runningId, setRunningId] = useState<string | null>(null)

  const handleComplete = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: true }))
    setRunningId(null)
  }

  const completedCount = Object.keys(completed).length
  const total = WARMUP_EXERCISES.length
  const allCompleted = completedCount === total
  const progressPercent = (completedCount / total) * 100

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push('/workout/knockknee')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="mx-auto text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Step 3 of 6
        </div>
        <div className="w-9" />
      </div>

      <h1 className="text-2xl font-bold tracking-widest uppercase mb-1">Full Body Warm-Up</h1>
      <p className="text-zinc-500 text-sm mb-6">3–5 minutes</p>

      <div className="w-full rounded-xl overflow-hidden mb-6 bg-zinc-900 border border-zinc-800">
        <Image 
          src={WARMUP_IMAGE} 
          alt="Warm Up Routine" 
          width={600} 
          height={300} 
          className="w-full h-48 object-cover opacity-80"
        />
      </div>

      <div className="flex justify-between items-end mb-4">
        <span className="text-sm font-medium text-zinc-400">Progress</span>
        <span className="text-xs font-bold text-zinc-500">{completedCount} / {total} completed</span>
      </div>
      <Progress value={progressPercent} className="mb-8" />

      <motion.div variants={staggerChildren} initial="initial" animate="animate" className="flex-1 overflow-y-auto pb-4">
        {WARMUP_EXERCISES.map(ex => (
          <ExerciseTimerRow
            key={ex.id}
            name={ex.name}
            durationSeconds={ex.durationSeconds}
            isRunning={runningId === ex.id}
            onStart={() => setRunningId(ex.id)}
            onComplete={() => handleComplete(ex.id)}
          />
        ))}
      </motion.div>

      <div className="pt-4 mt-auto">
        <Button 
          className="w-full h-14 text-sm tracking-widest uppercase font-bold"
          disabled={!allCompleted}
          onClick={() => {
            setPhase('session')
            router.push('/workout/session')
          }}
        >
          Begin Workout →
        </Button>
      </div>
    </div>
  )
}
