import { create } from 'zustand'
import { WorkoutPhase } from '@/types/workout'

export interface CompletedSet {
  exerciseId:  number
  setNumber:   number
  actualReps:  number
  completed:   boolean
  timestamp:   Date
}

interface WorkoutStore {
  sessionId:        string | null
  day:              string
  startTime:        Date | null
  completedSets:    CompletedSet[]
  currentPhase:     WorkoutPhase
  completionScore:  number
  xpEarned:         number
  newAchievements:  string[]

  startSession:     (day: string) => void
  addSet:           (set: CompletedSet) => void
  setPhase:         (phase: WorkoutPhase) => void
  finishSession:    (score: number) => void
  reset:            () => void
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  sessionId:       null,
  day:             '',
  startTime:       null,
  completedSets:   [],
  currentPhase:    'posture',
  completionScore: 0,
  xpEarned:        0,
  newAchievements: [],

  startSession: (day) => set({ day, startTime: new Date(), sessionId: crypto.randomUUID() }),
  addSet: (s)  => set((state) => ({ completedSets: [...state.completedSets, s] })),
  setPhase: (p) => set({ currentPhase: p }),
  finishSession: (score) => set({ completionScore: score }),
  reset: () => set({ sessionId: null, day: '', startTime: null, completedSets: [], completionScore: 0 }),
}))
