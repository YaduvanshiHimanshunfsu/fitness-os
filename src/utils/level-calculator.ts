import { LEVELS } from '@/constants/levels'

export function getLevelFromXP(totalXP: number) {
  let current = LEVELS[0]
  for (const level of LEVELS) {
    if (totalXP >= level.xpRequired) current = level
    else break
  }
  const next = LEVELS.find(l => l.xpRequired > totalXP)
  const xpToNext = next ? next.xpRequired - totalXP : 0
  return { current, next, xpToNext }
}
