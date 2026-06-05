export function getTodayDay(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
}

export function isRestDay(): boolean {
  return getTodayDay() === 'thursday'
}

export function formatWorkoutDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}
