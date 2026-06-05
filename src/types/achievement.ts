export interface Achievement {
  id: number
  name: string
  description: string
  conditionType: 'streak' | 'total_sets' | 'total_workouts' | 'perfect_week'
  conditionValue: number
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

export type Level = {
  level: number
  name: string
  xpRequired: number
  color: string
}
