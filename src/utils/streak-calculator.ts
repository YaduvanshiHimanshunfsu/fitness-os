import { differenceInCalendarDays } from 'date-fns'

export function calculateNewStreak(lastWorkoutDate: Date | null, currentStreak: number): number {
  if (!lastWorkoutDate) return 1
  const diff = differenceInCalendarDays(new Date(), lastWorkoutDate)
  if (diff === 1) return currentStreak + 1
  if (diff === 0) return currentStreak
  return 1
}
