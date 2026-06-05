export interface Exercise {
  id: number
  name: string
  muscleGroup: MuscleGroup
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  imageUrl: string
  instructions?: string
  sets: number
  reps: string
  exerciseOrder: number
}

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'forearms' | 'legs' | 'abs' | 'posture' | 'fullbody'
