'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { POSTURE_EXERCISES, POSTURE_IMAGE } from '@/constants/posture-routine'
import { CheckboxRow } from '@/components/workout/CheckboxRow'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { staggerChildren } from '@/lib/animations'

export default function PostureRoutinePage() {
  const router = useRouter()
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggleCheck = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const completedCount = Object.values(checked).filter(Boolean).length
  const total = POSTURE_EXERCISES.length
  const allCompleted = completedCount === total
  const progressPercent = (completedCount / total) * 100

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push('/dashboard')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="mx-auto text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Step 1 of 6
        </div>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <h1 className="text-2xl font-bold tracking-widest uppercase mb-1">Posture Routine</h1>
      <p className="text-zinc-500 text-sm mb-6">~5 minutes · Daily</p>

      <div className="w-full rounded-xl overflow-hidden mb-6 bg-zinc-900 border border-zinc-800">
        <Image 
          src={POSTURE_IMAGE} 
          alt="Posture Routine" 
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
        {POSTURE_EXERCISES.map(ex => (
          <CheckboxRow
            key={ex.id}
            label={ex.name}
            detail={`${ex.sets} × ${ex.reps}`}
            checked={!!checked[ex.id]}
            onToggle={() => toggleCheck(ex.id)}
          />
        ))}
      </motion.div>

      <div className="pt-4 mt-auto">
        <Button 
          className="w-full h-14 text-sm tracking-widest uppercase font-bold"
          disabled={!allCompleted}
          onClick={() => router.push('/workout/knockknee')}
        >
          Next Step →
        </Button>
      </div>
    </div>
  )
}
