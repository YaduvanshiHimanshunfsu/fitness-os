'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { Exercise } from '@/types/exercise'
import { useWorkoutStore } from '@/hooks/useWorkout'
import { WireframeExerciseCard } from '@/components/workout/WireframeExerciseCard'
import { WireframeRestScreen } from '@/components/workout/WireframeRestScreen'

export function WorkoutFlow({ exercises }: { exercises: Exercise[] }) {
  const router = useRouter()
  const {
    addSet,
    undoLastSet,
    setPhase,
    startRestTimer,
    clearRestTimer,
    restTimerEnd,
    isPaused,
    pausedTimeRemaining,
    activeExerciseIndex,
    sessionPhase,
    setActiveExerciseIndex,
    setSessionPhase,
    restartSession,
  } = useWorkoutStore()
  
  const [currentIndex, setCurrentIndex] = useState(activeExerciseIndex)
  const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({})
  const [phase, setLocalPhase] = useState<'exercise' | 'rest' | 'rest_exercise'>(sessionPhase)

  const currentExercise = exercises[currentIndex]
  const currentCompleted = completedSets[currentExercise.id] || Array(currentExercise.sets).fill(false)

  useEffect(() => {
    setActiveExerciseIndex(currentIndex)
  }, [currentIndex, setActiveExerciseIndex])

  useEffect(() => {
    setSessionPhase(phase)
  }, [phase, setSessionPhase])

  const handleRestartWorkout = () => {
    restartSession()
    setCurrentIndex(0)
    setLocalPhase('exercise')
    setCompletedSets({})
    clearRestTimer()
  }

  const handleRestComplete = useCallback(() => {
    clearRestTimer();
    if (phase === 'rest_exercise') {
      setCurrentIndex(prev => Math.min(prev + 1, exercises.length - 1))
    }
    setLocalPhase('exercise')
  }, [clearRestTimer, phase, exercises.length]);

  // Auto-advance when rest timer expires (skip if paused)
  useEffect(() => {
    if (phase === 'exercise' || isPaused || !restTimerEnd) return;
    
    const interval = setInterval(() => {
      if (Date.now() >= restTimerEnd) {
        clearRestTimer();
        handleRestComplete();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [phase, restTimerEnd, isPaused, clearRestTimer, handleRestComplete]);

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

    const isLastSet = setIndex === currentExercise.sets - 1
    const isLastExercise = currentIndex === exercises.length - 1

    if (isLastSet && isLastExercise) {
      // Don't trigger rest on the very last set
    } else {
      startRestTimer(15) 
      setLocalPhase('rest')
    }
  }

  // ─── Undo handler ─────────────────────────────────────────────────
  const handleUndoSet = (exerciseId: number, setIndex: number) => {
    // Remove from Zustand global store
    const removed = undoLastSet()
    if (!removed) return

    // Reset local completed state for this set
    const current = completedSets[exerciseId] || []
    const updated = [...current]
    updated[setIndex] = false
    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: updated
    }))
  }

  const handleSkipExercise = () => {
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
      startRestTimer(30)
      setLocalPhase('rest_exercise')
    }
  }

  const nextExerciseName = phase === 'rest_exercise'
    ? (exercises[currentIndex + 1]?.name || 'Posture Routine')
    : currentExercise.name

  // ─── Display timer (handles both running and paused) ──────────────
  const [displayTimeLeft, setDisplayTimeLeft] = useState(0);

  useEffect(() => {
    if (isPaused && pausedTimeRemaining !== null) {
      // Show frozen time when paused
      setDisplayTimeLeft(Math.max(0, Math.ceil(pausedTimeRemaining / 1000)));
      return;
    }
    if (!restTimerEnd) return;
    const updateTime = () => {
      const remaining = Math.max(0, Math.ceil((restTimerEnd - Date.now()) / 1000));
      setDisplayTimeLeft(remaining);
    };
    updateTime();
    const iv = setInterval(updateTime, 100);
    return () => clearInterval(iv);
  }, [restTimerEnd, isPaused, pausedTimeRemaining]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleRestartWorkout}
          className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Restart Workout
        </button>
      </div>

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
            onUndoSet={handleUndoSet}
          />
        ) : (
          <WireframeRestScreen 
            key="rest"
            timeLeft={displayTimeLeft}
            nextExerciseName={nextExerciseName}
            onSkip={handleRestComplete}
            onResume={() => setLocalPhase('exercise')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
