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
  weight_kg?:   number
  unit?:        string
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
  activeExerciseIndex: number
  sessionPhase:       'exercise' | 'rest' | 'rest_exercise'
  currentPhase:       WorkoutPhase
  completionScore:    number
  xpEarned:           number
  newAchievements:    string[]
  estimatedMinutes:   number
  todayExercises:     Exercise[]
  isSessionActive:    boolean
  
  // Advanced Rest Timer
  restTimerEnd:       number | null
  defaultRestSeconds: number

  startSession:       (day: string, estimatedMinutes: number, exercises: Exercise[]) => void
  addSet:             (set: CompletedSet) => void
  addSkipped:         (item: SkippedItem) => void
  setActiveExerciseIndex: (index: number) => void
  setSessionPhase:    (phase: 'exercise' | 'rest' | 'rest_exercise') => void
  restartSession:     () => void
  setPhase:           (phase: WorkoutPhase) => void
  finishSession:      (score: number) => void
  startRestTimer:     (seconds?: number) => void
  addRestTime:        (seconds: number) => void
  clearRestTimer:     () => void
  setDefaultRestSeconds: (seconds: number) => void
  setExercises:       (exercises: Exercise[]) => void
  reset:              () => void
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      sessionId:          null,
      day:                '',
      startTime:          null,
      completedSets:      [],
      skippedItems:       [],
      activeExerciseIndex: 0,
      sessionPhase:       'exercise',
      currentPhase:       'posture',
      completionScore:    0,
      xpEarned:           0,
      newAchievements:    [],
      estimatedMinutes:   0,
      todayExercises:     [],
      isSessionActive:    false,
      
      restTimerEnd:       null,
      defaultRestSeconds: 60,

      startSession: (day, estimatedMinutes, exercises) =>
        set({
          day,
          startTime:        new Date(),
          sessionId:        crypto.randomUUID(),
          completedSets:    [],
          skippedItems:     [],
          activeExerciseIndex: 0,
          sessionPhase:     'exercise',
          completionScore:  0,
          estimatedMinutes,
          todayExercises:   exercises,
          isSessionActive:  true,
          currentPhase:     'posture',
          restTimerEnd:     null,
        }),

      addSet: (s) =>
        set((state) => ({ completedSets: [...state.completedSets, s] })),

      addSkipped: (item) =>
        set((state) => ({ skippedItems: [...state.skippedItems, item] })),

      setActiveExerciseIndex: (index) => set({ activeExerciseIndex: Math.max(0, index) }),

      setSessionPhase: (phase) => set({ sessionPhase: phase }),

      restartSession: () =>
        set((state) => ({
          sessionId: crypto.randomUUID(),
          startTime: new Date(),
          completedSets: [],
          skippedItems: [],
          activeExerciseIndex: 0,
          sessionPhase: 'exercise',
          completionScore: 0,
          restTimerEnd: null,
          isSessionActive: true,
          day: state.day,
          estimatedMinutes: state.estimatedMinutes,
          todayExercises: state.todayExercises,
        })),

      setPhase: (p) => set({ currentPhase: p }),

      finishSession: (score) =>
        set({ completionScore: score, isSessionActive: false, restTimerEnd: null }),

      startRestTimer: (seconds) => {
        const duration = seconds ?? get().defaultRestSeconds;
        set({ restTimerEnd: Date.now() + duration * 1000 });
      },

      addRestTime: (seconds) => {
        const currentEnd = get().restTimerEnd;
        if (currentEnd) {
          set({ restTimerEnd: currentEnd + seconds * 1000 });
        }
      },

      clearRestTimer: () => set({ restTimerEnd: null }),

      setDefaultRestSeconds: (seconds) => set({ defaultRestSeconds: seconds }),

      setExercises: (exercises) => set({ todayExercises: exercises }),

      reset: () =>
        set({
          sessionId:          null,
          day:                '',
          startTime:          null,
          completedSets:      [],
          skippedItems:       [],
          activeExerciseIndex: 0,
          sessionPhase:       'exercise',
          completionScore:    0,
          estimatedMinutes:   0,
          todayExercises:     [],
          isSessionActive:    false,
          restTimerEnd:       null,
        }),
    }),
    {
      name: 'fitness-os-workout-storage',
    }
  )
)
