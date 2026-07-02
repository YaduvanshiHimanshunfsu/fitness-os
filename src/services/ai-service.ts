import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

export class AIService {
  private static async getGeminiKey(): Promise<string | null> {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
    const prompt = `You are a supportive, high-energy AI Fitness Coach. 
    The athlete's name is ${userName}. 
    They have a current workout streak of ${currentStreak} days and their current XP level is ${activeLevel}.
    Write a short, punchy, 2-sentence motivational daily tip for them. Do not use hashtags. Keep it under 150 characters if possible.`

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (error: any) {
      if (error.message && error.message.includes('404')) {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt)
        return result.response.text().trim()
      }
      throw error;
    }
  }

  public static async generatePostWorkoutSummary(
    duration: number,
    calories: number,
    muscleVolume: { name: string; reps: number }[]
  ): Promise<string> {
    const key = await this.getGeminiKey()
    if (!key) throw new Error('AI Coach is not configured.')

    const genAI = new GoogleGenerativeAI(key)

    const volumeContext = muscleVolume.map(m => `${m.reps} reps of ${m.name}`).join(', ')

    const prompt = `You are a supportive, high-energy AI Fitness Coach. 
    The athlete just finished a workout lasting ${duration} minutes, burning ${calories} calories.
    They completed the following volume: ${volumeContext}.
    Write a short, exciting 2-sentence coach's note praising their effort on those specific muscles. Do not use hashtags.`

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (error: any) {
      if (error.message && error.message.includes('404')) {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const result = await model.generateContent(prompt)
        return result.response.text().trim()
      }
      throw error;
    }
  }

  public static async chatWithFitnessAgent(history: { role: string; content: string }[], newMessage: string, dbContext: string = ""): Promise<string> {
    const key = await this.getGeminiKey()
    if (!key) throw new Error('AI Coach is not configured.')

    const genAI = new GoogleGenerativeAI(key)
    
    let systemInstruction = `You are a highly advanced elite fitness, health, and nutrition AI Agent built into FITNESS OS. 
    Your ONLY purpose is to answer questions, clear doubts, and provide guidance strictly related to exercise, bodybuilding, diet, nutrition, recovery, and general physical health.
    IMPORTANT RULES:
    1. If the user asks about ANY topic outside of fitness, health, diet, or exercise (e.g., programming, coding, politics, history, general knowledge, writing code), you MUST politely refuse and state that you are a dedicated Fitness AI and can only answer health and fitness related questions.
    2. Be supportive, concise, and highly knowledgeable. Provide actionable and scientifically backed advice.
    3. Do NOT use hashtags.`

    if (dbContext) {
      systemInstruction += `\n\nUSER WORKOUT CONTEXT:\n${dbContext}\nUse this context to give highly personalized advice.`
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemInstruction 
      })

      const chat = model.startChat({
        history: history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      })

      const result = await chat.sendMessage([{ text: newMessage }])
      return result.response.text().trim()
    } catch (error: any) {
      if (error.message && error.message.includes('404')) {
        console.warn('gemini-1.5-flash not found, falling back to gemini-pro')
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        const chat = model.startChat({
          history: history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }))
        })
        const result = await chat.sendMessage([{ text: `System Instruction: ${systemInstruction}\n\nUser Message: ${newMessage}` }])
        return result.response.text().trim()
      }
      throw error;
    }
  }
}
