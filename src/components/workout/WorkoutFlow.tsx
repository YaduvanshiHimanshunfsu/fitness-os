'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { Exercise } from '@/types/exercise'
import { ExerciseCard } from '@/components/exercise/ExerciseCard'
import { ExerciseProgress } from '@/components/exercise/ExerciseProgress'
import { RestScreen } from '@/components/workout/RestScreen'
import { useWorkoutStore } from '@/hooks/useWorkout'

export function WorkoutFlow({ exercises }: { exercises: Exercise[] }) {
  const router = useRouter()
  const { addSet, setPhase } = useWorkoutStore()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({})
  const [phase, setLocalPhase] = useState<'exercise' | 'rest'>('exercise')
  const [restForSet, setRestForSet] = useState(0)

  const currentExercise = exercises[currentIndex]
  const currentCompleted = completedSets[currentExercise.id] || Array(currentExercise.sets).fill(false)

  const handleSetComplete = (setIndex: number) => {
    // Only allow completing sets in order (optional, but good UX)
    if (currentCompleted[setIndex]) return // already done

    const newCompleted = [...currentCompleted]
    newCompleted[setIndex] = true
    
    setCompletedSets(prev => ({
      ...prev,
      [currentExercise.id]: newCompleted
    }))

    // Save to Zustand store
    // We assume an actual actualReps input in a real app, defaulting to max reps here for simplicity
    const repsNum = parseInt(currentExercise.reps.split('-')[0] || '10')
    addSet({
      exerciseId: currentExercise.id,
      setNumber: setIndex + 1,
      actualReps: isNaN(repsNum) ? 1 : repsNum,
      completed: true,
      timestamp: new Date()
    })

    const isLastSet = setIndex === currentExercise.sets - 1
    const isLastExercise = currentIndex === exercises.length - 1

    if (isLastSet && isLastExercise) {
      // Workout Complete!
      setTimeout(() => {
        setPhase('cooldown')
        router.push('/workout/cooldown')
      }, 500)
    } else if (isLastSet) {
      // Exercise complete, advance to next exercise immediately or rest?
      // Let's do a slightly longer rest between exercises
      setRestForSet(setIndex + 1)
      setLocalPhase('rest')
    } else {
      // Standard rest between sets
      setRestForSet(setIndex + 1)
      setLocalPhase('rest')
    }
  }

  const handleRestComplete = () => {
    const isLastSet = restForSet === currentExercise.sets
    if (isLastSet) {
      setCurrentIndex(prev => prev + 1)
    }
    setLocalPhase('exercise')
  }

  const totalSetsCompleted = Object.values(completedSets).reduce((acc, arr) => acc + arr.filter(Boolean).length, 0)
  const totalTargetSets = exercises.reduce((acc, ex) => acc + ex.sets, 0)

  const nextLabel = restForSet === currentExercise.sets
    ? `Next: ${exercises[currentIndex + 1]?.name || 'Cooldown'}`
    : `Set ${restForSet + 1} of ${currentExercise.name}`

  return (
    <>
      <AnimatePresence mode="wait">
        {phase === 'exercise' ? (
          <ExerciseCard 
            key={currentExercise.id}
            exercise={currentExercise}
            currentIndex={currentIndex}
            totalExercises={exercises.length}
            completedSets={currentCompleted}
            onSetComplete={handleSetComplete}
          />
        ) : (
          <RestScreen 
            key="rest"
            durationSeconds={15}
            setNumber={restForSet}
            exerciseName={currentExercise.name}
            nextLabel={nextLabel}
            onComplete={handleRestComplete}
            onSkip={handleRestComplete}
          />
        )}
      </AnimatePresence>

      <ExerciseProgress 
        completedSets={totalSetsCompleted} 
        totalSets={totalTargetSets} 
        exerciseName="Overall Progress" 
      />
    </>
  )
}
