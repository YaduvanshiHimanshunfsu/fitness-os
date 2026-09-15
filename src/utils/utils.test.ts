import { describe, it, expect } from 'vitest'
import { calculateXP } from './xp-calculator'
import { calculateNewStreak } from './streak-calculator'
import { getLevelFromXP } from './level-calculator'

// ── XP Calculator ─────────────────────────────────────────────────────
describe('calculateXP', () => {
  it('returns base XP (50) for any partial session', () => {
    expect(calculateXP(50)).toBe(50)
    expect(calculateXP(0)).toBe(50)
    expect(calculateXP(99)).toBe(50)
  })

  it('returns base + bonus (60) for a perfect 100% session', () => {
    expect(calculateXP(100)).toBe(60)
  })
})

// ── Streak Calculator ─────────────────────────────────────────────────
describe('calculateNewStreak', () => {
  it('starts at 1 when there is no previous workout', () => {
    expect(calculateNewStreak(null, 0)).toBe(1)
  })

  it('increments streak when last workout was yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(calculateNewStreak(yesterday, 5)).toBe(6)
  })

  it('keeps streak the same when logging twice on the same day', () => {
    const today = new Date()
    expect(calculateNewStreak(today, 3)).toBe(3)
  })

  it('resets streak to 1 when last workout was 2+ days ago', () => {
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    expect(calculateNewStreak(twoDaysAgo, 10)).toBe(1)
  })
})

// ── Level Calculator ──────────────────────────────────────────────────
describe('getLevelFromXP', () => {
  it('returns Beginner at 0 XP', () => {
    expect(getLevelFromXP(0).current?.name).toBe('Beginner')
  })

  it('returns Consistent at 200 XP', () => {
    expect(getLevelFromXP(200).current?.name).toBe('Consistent')
  })

  it('returns Elite at 5000 XP', () => {
    expect(getLevelFromXP(5000).current?.name).toBe('Elite')
  })

  it('returns Legend at 15000 XP', () => {
    expect(getLevelFromXP(15000).current?.name).toBe('Legend')
  })

  it('xpToNext should be 0 at max level', () => {
    expect(getLevelFromXP(999999).xpToNext).toBe(0)
  })
})
