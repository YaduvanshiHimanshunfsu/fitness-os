import { differenceInCalendarDays } from 'date-fns'

export function calculateNewStreak(lastWorkoutDate: Date | null, currentStreak: number, todayDate: Date = new Date()): number {
  if (!lastWorkoutDate) return 1
  const diff = differenceInCalendarDays(todayDate, lastWorkoutDate)
  if (diff === 1) return currentStreak + 1
  if (diff === 0) return currentStreak
  return 1
}
