import { XP_PER_WORKOUT, XP_PERFECT_BONUS } from '@/constants/levels'

export function calculateXP(completionScore: number): number {
  const base = XP_PER_WORKOUT
  const bonus = completionScore === 100 ? XP_PERFECT_BONUS : 0
  return base + bonus
}
