import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

export class AIService {
  private static async getGeminiKey(): Promise<string | null> {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'gemini_api_key')
      .single()
    
    if (data?.value) {
      return JSON.parse(data.value as string) as string
    }
    return process.env.GEMINI_API_KEY || null
  }

  public static async generateDailyInsight(userName: string, currentStreak: number, activeLevel: string): Promise<string> {
    const key = await this.getGeminiKey()
    if (!key) throw new Error('AI Coach is not configured.')

    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a supportive, high-energy AI Fitness Coach. 
    The athlete's name is ${userName}. 
    They have a current workout streak of ${currentStreak} days and their current XP level is ${activeLevel}.
    Write a short, punchy, 2-sentence motivational daily tip for them. Do not use hashtags. Keep it under 150 characters if possible.`

    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  }

  public static async generatePostWorkoutSummary(
    duration: number,
    calories: number,
    muscleVolume: { name: string; reps: number }[]
  ): Promise<string> {
    const key = await this.getGeminiKey()
    if (!key) throw new Error('AI Coach is not configured.')

    const genAI = new GoogleGenerativeAI(key)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const volumeContext = muscleVolume.map(m => `${m.reps} reps of ${m.name}`).join(', ')

    const prompt = `You are a supportive, high-energy AI Fitness Coach. 
    The athlete just finished a workout lasting ${duration} minutes, burning ${calories} calories.
    They completed the following volume: ${volumeContext}.
    Write a short, exciting 2-sentence coach's note praising their effort on those specific muscles. Do not use hashtags.`

    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  }
}
