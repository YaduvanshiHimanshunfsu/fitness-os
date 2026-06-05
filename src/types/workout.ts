export type WorkoutDay = 'monday' | 'tuesday' | 'wednesday' | 'friday' | 'saturday' | 'sunday'
export type WorkoutPhase = 'posture' | 'knockknee' | 'warmup' | 'session' | 'cooldown' | 'summary'

export interface WorkoutSession {
  sessionId: string
  day: WorkoutDay
  startTime: Date
  completedSets: CompletedSet[]
  currentPhase: WorkoutPhase
  completionScore: number
}

export interface CompletedSet {
  exerciseId: number
  setNumber: number
  actualReps: number
  completed: boolean
  timestamp: Date
}
