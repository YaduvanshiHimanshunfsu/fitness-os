'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { WorkoutFlow } from '@/components/workout/WorkoutFlow'
import { EXERCISES } from '@/constants/exercises'
import { useWorkoutStore } from '@/hooks/useWorkout'
import { getTodayDay } from '@/utils/date-utils'
import { motion } from 'framer-motion'

export default function ClientSessionPage({ templates }: { templates: any[] }) {
  const router = useRouter()
  // Ensure we get today's exercises. In a real app, this should be selected based on the user's dashboard interaction.
  // We use useWorkoutStore day or fallback to today.
  const {
    day,
    isSessionActive,
    completedSets,
    activeExerciseIndex,
    restartSession,
  } = useWorkoutStore()
  const currentDay = day || getTodayDay()
  
  const todayTemplate = templates.find(t => t.day === currentDay)
  const dbExercises = todayTemplate?.workout_template_exercises?.sort((a: any, b: any) => a.exercise_order - b.exercise_order) || []
  
  const todayExercises = dbExercises.map((te: any) => ({
    id: te.exercises.id,
    name: te.exercises.name,
    muscleGroup: te.exercises.muscle_group,
    imageUrl: te.exercises.image_url || '/placeholder.png',
    sets: te.sets,
    reps: te.reps,
    exerciseOrder: te.exercise_order,
    day: currentDay
  }))

  const hasSavedProgress = isSessionActive && (completedSets.length > 0 || activeExerciseIndex > 0)
  const [showWorkout, setShowWorkout] = useState(!hasSavedProgress)

  if (todayExercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-20">
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">No exercises found for today.</p>
        <button onClick={() => router.push('/dashboard')} className="text-zinc-800 dark:text-zinc-100 underline">
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center mb-6">
        <button onClick={() => router.push('/workout/warmup')} className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="mx-auto text-xs font-bold tracking-widest text-zinc-500 uppercase">
          Step 4 of 6
        </div>
        <div className="w-9" />
      </div>

      {hasSavedProgress && !showWorkout && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#FF4500]">Saved progress found</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Resume from where you left off or restart the workout from the beginning.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowWorkout(true)}
              className="px-4 py-2 rounded-xl bg-[#FF4500] text-zinc-900 dark:text-white text-xs font-bold uppercase tracking-widest"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={() => {
                restartSession()
                setShowWorkout(true)
              }}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-widest"
            >
              Restart
            </button>
          </div>
        </motion.div>
      )}

      {showWorkout && <WorkoutFlow exercises={todayExercises} />}
    </div>
  )
}
