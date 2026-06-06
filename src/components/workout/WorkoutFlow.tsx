'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { Exercise } from '@/types/exercise'
import { useWorkoutStore } from '@/hooks/useWorkout'
import { WireframeExerciseCard } from '@/components/workout/WireframeExerciseCard'
import { WireframeRestScreen } from '@/components/workout/WireframeRestScreen'

export function WorkoutFlow({ exercises }: { exercises: Exercise[] }) {
  const router = useRouter()
  const { addSet, setPhase } = useWorkoutStore()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({})
  const [phase, setLocalPhase] = useState<'exercise' | 'rest' | 'rest_exercise'>('exercise')
  const [restTimeLeft, setRestTimeLeft] = useState(0)

  const currentExercise = exercises[currentIndex]
  const currentCompleted = completedSets[currentExercise.id] || Array(currentExercise.sets).fill(false)

  // Timer for rest screen
  useEffect(() => {
    if (phase === 'exercise' || restTimeLeft <= 0) return
    const timer = setInterval(() => setRestTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [phase, restTimeLeft])

  // Handle rest completion
  useEffect(() => {
    if (phase !== 'exercise' && restTimeLeft === 0) {
      handleRestComplete()
    }
  }, [restTimeLeft, phase])

  const handleSetComplete = (setIndex: number) => {
    if (currentCompleted[setIndex]) return 

    const newCompleted = [...currentCompleted]
    newCompleted[setIndex] = true
    
    setCompletedSets(prev => ({
      ...prev,
      [currentExercise.id]: newCompleted
    }))

    const repsNum = parseInt(currentExercise.reps.split('-')[0] || '10')
    addSet({
      exerciseId:   currentExercise.id,
      exerciseName: currentExercise.name,
      setNumber:    setIndex + 1,
      actualReps:   isNaN(repsNum) ? 1 : repsNum,
      completed:    true,
      timestamp:    new Date()
    })

    // If it's the very last set of the very last exercise, we don't need a rest
    const isLastSet = setIndex === currentExercise.sets - 1
    const isLastExercise = currentIndex === exercises.length - 1

    if (isLastSet && isLastExercise) {
      // Don't trigger 15s rest if it's the very last set, wait for user to click Finish
    } else {
      // Trigger 15s rest between sets immediately after checking the box
      setRestTimeLeft(15) 
      setLocalPhase('rest')
    }
  }

  const handleSkipExercise = () => {
    // Log all remaining incomplete sets as completed: false
    currentCompleted.forEach((isCompleted, setIndex) => {
      if (!isCompleted) {
        addSet({
          exerciseId:   currentExercise.id,
          exerciseName: currentExercise.name,
          setNumber:    setIndex + 1,
          actualReps:   0,
          completed:    false,
          timestamp:    new Date()
        })
      }
    })
    
    handleFinishExercise()
  }

  const handleFinishExercise = () => {
    const isLastExercise = currentIndex === exercises.length - 1
    if (isLastExercise) {
      setPhase('cooldown')
      router.push('/workout/posture')
    } else {
      // 30s rest between exercises
      setRestTimeLeft(30)
      setLocalPhase('rest_exercise') // special phase for 30s rest
    }
  }

  const handleRestComplete = () => {
    if (phase === 'rest_exercise') {
      setCurrentIndex(prev => prev + 1)
    }
    setLocalPhase('exercise')
  }

  const nextExerciseName = phase === 'rest_exercise'
    ? (exercises[currentIndex + 1]?.name || 'Posture Routine')
    : currentExercise.name

  return (
    <AnimatePresence mode="wait">
      {phase === 'exercise' ? (
        <WireframeExerciseCard 
          key={currentExercise.id}
          exercise={currentExercise}
          currentIndex={currentIndex}
          totalExercises={exercises.length}
          completedSets={currentCompleted}
          onSetComplete={handleSetComplete}
          onFinishExercise={handleFinishExercise}
          onSkipExercise={handleSkipExercise}
        />
      ) : (
        <WireframeRestScreen 
          key="rest"
          timeLeft={restTimeLeft}
          nextExerciseName={nextExerciseName}
          onSkip={handleRestComplete}
        />
      )}
    </AnimatePresence>
  )
}
