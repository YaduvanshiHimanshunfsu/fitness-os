import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WorkoutPhase } from '@/types/workout'
import { Exercise } from '@/constants/exercises'

export interface CompletedSet {
  exerciseId:   number
  exerciseName: string
  setNumber:    number
  actualReps:   number
  completed:    boolean
  timestamp:    Date
}

export interface SkippedItem {
  exerciseId:   number
  exerciseName: string
  setNumber:    number
  reason:       'skipped' | 'rest_skipped'
}

interface WorkoutStore {
  sessionId:          string | null
  day:                string
  startTime:          Date | null
  completedSets:      CompletedSet[]
  skippedItems:       SkippedItem[]
  currentPhase:       WorkoutPhase
  completionScore:    number
  xpEarned:           number
  newAchievements:    string[]
  estimatedMinutes:   number
  todayExercises:     Exercise[]
  isSessionActive:    boolean

  startSession:       (day: string, estimatedMinutes: number, exercises: Exercise[]) => void
  addSet:             (set: CompletedSet) => void
  addSkipped:         (item: SkippedItem) => void
  setPhase:           (phase: WorkoutPhase) => void
  finishSession:      (score: number) => void
  reset:              () => void
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      sessionId:          null,
      day:                '',
      startTime:          null,
      completedSets:      [],
      skippedItems:       [],
      currentPhase:       'posture',
      completionScore:    0,
      xpEarned:           0,
      newAchievements:    [],
      estimatedMinutes:   0,
      todayExercises:     [],
      isSessionActive:    false,

      startSession: (day, estimatedMinutes, exercises) =>
        set({
          day,
          startTime:        new Date(),
          sessionId:        crypto.randomUUID(),
          completedSets:    [],
          skippedItems:     [],
          completionScore:  0,
          estimatedMinutes,
          todayExercises:   exercises,
          isSessionActive:  true,
          currentPhase:     'posture',
        }),

      addSet: (s) =>
        set((state) => ({ completedSets: [...state.completedSets, s] })),

      addSkipped: (item) =>
        set((state) => ({ skippedItems: [...state.skippedItems, item] })),

      setPhase: (p) => set({ currentPhase: p }),

      finishSession: (score) =>
        set({ completionScore: score, isSessionActive: false }),

      reset: () =>
        set({
          sessionId:          null,
          day:                '',
          startTime:          null,
          completedSets:      [],
          skippedItems:       [],
          completionScore:    0,
          estimatedMinutes:   0,
          todayExercises:     [],
          isSessionActive:    false,
        }),
    }),
    {
      name: 'fitness-os-workout-storage',
    }
  )
)
