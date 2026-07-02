export interface UserProfile {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: string
  createdAt: Date
}

export interface UserStats {
  totalWorkouts: number
  totalSets: number
  totalReps: number
  currentStreak: number
  bestStreak: number
  currentLevel: number
  currentXP: number
  xpToNextLevel: number
}
