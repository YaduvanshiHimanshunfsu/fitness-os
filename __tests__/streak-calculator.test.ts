import { describe, it, expect } from 'vitest'
import { calculateNewStreak } from '@/utils/streak-calculator'

describe('calculateNewStreak', () => {
  it('should return streak 1 for first workout', () => {
    const today = new Date('2026-07-05T10:00:00Z')
    const result = calculateNewStreak(null, 0, today)
    expect(result).toBe(1)
  })

  it('should maintain streak on same day', () => {
    const today = new Date('2026-07-05T10:00:00Z')
    const lastWorkout = new Date('2026-07-05T08:00:00Z')
    const result = calculateNewStreak(lastWorkout, 5, today)
    expect(result).toBe(5)
  })

  it('should increment streak on next day', () => {
    const today = new Date('2026-07-06T10:00:00Z')
    const lastWorkout = new Date('2026-07-05T08:00:00Z')
    const result = calculateNewStreak(lastWorkout, 5, today)
    expect(result).toBe(6)
  })

  it('should reset streak if gap is more than 1 day', () => {
    const today = new Date('2026-07-07T10:00:00Z')
    const lastWorkout = new Date('2026-07-05T08:00:00Z')
    const result = calculateNewStreak(lastWorkout, 5, today)
    expect(result).toBe(1)
  })
})
