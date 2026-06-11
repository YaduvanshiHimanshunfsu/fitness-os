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
  const { addSet, setPhase, startRestTimer, clearRestTimer, restTimerEnd } = useWorkoutStore()
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({})
  const [phase, setLocalPhase] = useState<'exercise' | 'rest' | 'rest_exercise'>('exercise')

  const currentExercise = exercises[currentIndex]
  const currentCompleted = completedSets[currentExercise.id] || Array(currentExercise.sets).fill(false)

  // Wait for the global rest timer to finish if we are in a rest phase
  useEffect(() => {
    if (phase === 'exercise' || !restTimerEnd) return;
    
    const interval = setInterval(() => {
      if (Date.now() >= restTimerEnd) {
        clearRestTimer();
        handleRestComplete();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [phase, restTimerEnd]);

  const handleSetComplete = (setIndex: number, reps: number, weight: number, unit: string) => {
    if (currentCompleted[setIndex]) return 

    const newCompleted = [...currentCompleted]
    newCompleted[setIndex] = true
    
    setCompletedSets(prev => ({
      ...prev,
      [currentExercise.id]: newCompleted
    }))

    addSet({
      exerciseId:   currentExercise.id,
      exerciseName: currentExercise.name,
      setNumber:    setIndex + 1,
      actualReps:   reps,
      weight_kg:    unit === 'lbs' ? weight * 0.453592 : weight,
      unit:         unit,
      completed:    true,
      timestamp:    new Date()
    })

    // If it's the very last set of the very last exercise, we don't need a rest
    const isLastSet = setIndex === currentExercise.sets - 1
    const isLastExercise = currentIndex === exercises.length - 1

    if (isLastSet && isLastExercise) {
      // Don't trigger 15s rest if it's the very last set, wait for user to click Finish
    } else {
      // Trigger rest between sets using Zustand
      startRestTimer(15) 
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
      startRestTimer(30)
      setLocalPhase('rest_exercise') // special phase for 30s rest
    }
  }

  const handleRestComplete = () => {
    clearRestTimer();
    if (phase === 'rest_exercise') {
      setCurrentIndex(prev => prev + 1)
    }
    setLocalPhase('exercise')
  }

  const nextExerciseName = phase === 'rest_exercise'
    ? (exercises[currentIndex + 1]?.name || 'Posture Routine')
    : currentExercise.name

  const [displayTimeLeft, setDisplayTimeLeft] = useState(0);

  useEffect(() => {
    if (!restTimerEnd) return;
    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((restTimerEnd - Date.now()) / 1000));
      setDisplayTimeLeft(remaining);
    };
    updateTime();
    const iv = setInterval(updateTime, 100);
    return () => clearInterval(iv);
  }, [restTimerEnd]);

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
          timeLeft={displayTimeLeft}
          nextExerciseName={nextExerciseName}
          onSkip={handleRestComplete}
        />
      )}
    </AnimatePresence>
  )
}
