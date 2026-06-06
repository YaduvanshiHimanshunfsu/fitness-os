export interface Exercise {
  id: number
  name: string
  muscleGroup: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  imageUrl: string
  instructions?: string
  sets: number
  reps: string
  exerciseOrder: number
  day?: string
}

export type MuscleGroup = string
