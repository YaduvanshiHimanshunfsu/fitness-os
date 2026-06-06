'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { WorkoutFlow } from '@/components/workout/WorkoutFlow'
import { EXERCISES } from '@/constants/exercises'
import { useWorkoutStore } from '@/hooks/useWorkout'
import { getTodayDay } from '@/utils/date-utils'

export default function SessionPage() {
  const router = useRouter()
  // Ensure we get today's exercises. In a real app, this should be selected based on the user's dashboard interaction.
  // We use useWorkoutStore day or fallback to today.
  const { day } = useWorkoutStore()
  const currentDay = day || getTodayDay()
  
  const todayExercises = EXERCISES.filter(ex => ex.day === currentDay).sort((a, b) => a.exerciseOrder - b.exerciseOrder)

  if (todayExercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-20">
        <p className="text-zinc-400 mb-4">No exercises found for today.</p>
        <button onClick={() => router.push('/dashboard')} className="text-zinc-100 underline">
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push('/workout/warmup')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="mx-auto text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Step 4 of 6
        </div>
        <div className="w-9" />
      </div>

      <WorkoutFlow exercises={todayExercises} />
    </div>
  )
}
