'use server'

import { AIService } from '@/services/ai-service'

export async function getDailyInsight(userName: string, currentStreak: number, activeLevel: string) {
  try {
    const insight = await AIService.generateDailyInsight(userName, currentStreak, activeLevel)
    return { success: true, insight }
  } catch (error: any) {
    console.error('AI Insight Error:', error)
    return { success: false, error: error.message }
  }
}

export async function getPostWorkoutSummary(
  duration: number,
  calories: number,
  muscleVolume: { name: string; reps: number }[]
) {
  try {
    const summary = await AIService.generatePostWorkoutSummary(duration, calories, muscleVolume)
    return { success: true, summary }
  } catch (error: any) {
    console.error('AI Summary Error:', error)
    return { success: false, error: error.message }
  }
}
