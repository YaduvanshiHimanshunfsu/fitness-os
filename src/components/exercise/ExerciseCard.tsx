'use client'
import Image from 'next/image'
import { Exercise } from '@/types/exercise'
import { SetTracker } from './SetTracker'
import { motion } from 'framer-motion'
import { slideRight } from '@/lib/animations'

export function ExerciseCard({
  exercise,
  currentIndex,
  totalExercises,
  completedSets,
  onSetComplete
}: {
  exercise: Exercise
  currentIndex: number
  totalExercises: number
  completedSets: boolean[]
  onSetComplete: (setIndex: number) => void
}) {
  return (
    <motion.div 
      variants={slideRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col h-full w-full pb-24" // padding-bottom for the fixed progress bar
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold tracking-widest uppercase text-zinc-500">
          Exercise {currentIndex + 1} of {totalExercises}
        </span>
      </div>

      <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">
        {exercise.name}
      </h2>

      <div className="w-full rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-6 relative group cursor-pointer">
        <Image 
          src={exercise.imageUrl} 
          alt={exercise.name} 
          width={600} 
          height={400} 
          className="w-full h-64 object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
        {/* Placeholder for fullscreen modal trigger in future */}
      </div>

      <div className="flex justify-between items-center mb-4 px-2">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Target</span>
        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
          {exercise.sets} × {exercise.reps}
        </span>
      </div>

      <SetTracker 
        totalSets={exercise.sets} 
        completedSets={completedSets} 
        onSetToggle={onSetComplete} 
      />
    </motion.div>
  )
}
