export interface HeatmapDay {
  date:      string
  completed: boolean
  isRestDay: boolean
}

export interface StreakRing {
  currentStreak:    number
  nextMilestone:    number
  progressPercent:  number
  remaining:        number
  milestoneName:    string
}

export function getStreakRing(current: number): StreakRing {
  const milestones = [7, 14, 30, 60, 90, 180, 365]
  const next = milestones.find((m) => m > current) ?? 365
  const prev = milestones.filter((m) => m <= current).at(-1) ?? 0
  return {
    currentStreak:   current,
    nextMilestone:   next,
    progressPercent: Math.round(((current - prev) / (next - prev)) * 100),
    remaining:       next - current,
    milestoneName:   `${next} day streak`,
  }
}
