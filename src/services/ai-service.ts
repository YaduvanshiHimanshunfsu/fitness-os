import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const MODELS_IN_ORDER = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'] as const

export class AIService {
  private static async getGeminiKey(): Promise<string | null> {
    // 1. Check environment variable first (fastest, no DB call)
    if (process.env.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY
    }

    // 2. Fallback: check app_settings table in Supabase
    try {
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
        // Handle both raw string and JSON-stringified values
        try {
          return JSON.parse(data.value as string) as string
        } catch {
          return data.value as string
        }
      }
    } catch (e) {
      console.warn('Failed to fetch Gemini key from app_settings:', e)
    }

    return null
  }

  /**
   * Try multiple Gemini models in order of preference.
   * Handles 404 (model not found) and 401 (bad key format) gracefully.
   */
  private static async tryGenerateContent(
    key: string,
    prompt: string
  ): Promise<string> {
    const genAI = new GoogleGenerativeAI(key)
    let lastError: Error | null = null

    for (const modelName of MODELS_IN_ORDER) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent(prompt)
        return result.response.text().trim()
      } catch (error: any) {
        lastError = error
        const msg = error?.message || ''
        // If model not found or unsupported, try next model
        if (msg.includes('404') || msg.includes('not found') || msg.includes('not supported')) {
          console.warn(`Model ${modelName} not available, trying next...`)
          continue
        }
        // For auth errors or other fatal errors, don't retry
        throw error
      }
    }

    throw lastError || new Error('All Gemini models failed')
  }

  /**
   * Try multiple Gemini models for chat with system instruction.
   */
  private static async tryChatContent(
    key: string,
    systemInstruction: string,
    history: { role: string; content: string }[],
    newMessage: string
  ): Promise<string> {
    const genAI = new GoogleGenerativeAI(key)
    let lastError: Error | null = null

    for (const modelName of MODELS_IN_ORDER) {
      try {
        const modelConfig: any = { model: modelName }
        // Only newer models support systemInstruction param
        if (modelName !== 'gemini-pro') {
          modelConfig.systemInstruction = systemInstruction
        }

        const model = genAI.getGenerativeModel(modelConfig)

        const chatHistory = history.map(msg => ({
          role: msg.role === 'user' ? 'user' as const : 'model' as const,
          parts: [{ text: msg.content }]
        }))

        const chat = model.startChat({ history: chatHistory })

        // For gemini-pro (no system instruction support), prepend context
        const messageText = modelName === 'gemini-pro'
          ? `Context: ${systemInstruction}\n\nUser: ${newMessage}`
          : newMessage

        const result = await chat.sendMessage([{ text: messageText }])
        return result.response.text().trim()
      } catch (error: any) {
        lastError = error
        const msg = error?.message || ''
        if (msg.includes('404') || msg.includes('not found') || msg.includes('not supported')) {
          console.warn(`Chat model ${modelName} not available, trying next...`)
          continue
        }
        throw error
      }
    }

    throw lastError || new Error('All Gemini chat models failed')
  }

  // ─── Public API ──────────────────────────────────────────────────────

  public static async generateDailyInsight(
    userName: string,
    currentStreak: number,
    activeLevel: string
  ): Promise<string> {
    const key = await this.getGeminiKey()
    if (!key) throw new Error('AI Coach is not configured. Please add your Gemini API key in Settings or set GEMINI_API_KEY environment variable.')

    const prompt = `You are a supportive, high-energy AI Fitness Coach. 
    The athlete's name is ${userName}. 
    They have a current workout streak of ${currentStreak} days and their current XP level is ${activeLevel}.
    Write a short, punchy, 2-sentence motivational daily tip for them. Do not use hashtags. Keep it under 150 characters if possible.`

    return this.tryGenerateContent(key, prompt)
  }

  public static async generatePostWorkoutSummary(
    duration: number,
    calories: number,
    muscleVolume: { name: string; reps: number }[]
  ): Promise<string> {
    const key = await this.getGeminiKey()
    if (!key) throw new Error('AI Coach is not configured. Please add your Gemini API key in Settings or set GEMINI_API_KEY environment variable.')

    const volumeContext = muscleVolume.map(m => `${m.reps} reps of ${m.name}`).join(', ')

    const prompt = `You are a supportive, high-energy AI Fitness Coach. 
    The athlete just finished a workout lasting ${duration} minutes, burning ${calories} calories.
    They completed the following volume: ${volumeContext}.
    Write a short, exciting 2-sentence coach's note praising their effort on those specific muscles. Do not use hashtags.`

    return this.tryGenerateContent(key, prompt)
  }

  public static async chatWithFitnessAgent(
    history: { role: string; content: string }[],
    newMessage: string,
    dbContext: string = ""
  ): Promise<string> {
    const key = await this.getGeminiKey()
    if (!key) throw new Error('AI Coach is not configured. Please add your Gemini API key in Settings or set GEMINI_API_KEY environment variable.')

    let systemInstruction = `You are a highly advanced elite fitness, health, and nutrition AI Agent built into FITNESS OS. 
    Your ONLY purpose is to answer questions, clear doubts, and provide guidance strictly related to exercise, bodybuilding, diet, nutrition, recovery, and general physical health.
    IMPORTANT RULES:
    1. If the user asks about ANY topic outside of fitness, health, diet, or exercise (e.g., programming, coding, politics, history, general knowledge, writing code), you MUST politely refuse and state that you are a dedicated Fitness AI and can only answer health and fitness related questions.
    2. Be supportive, concise, and highly knowledgeable. Provide actionable and scientifically backed advice.
    3. Do NOT use hashtags.`

    if (dbContext) {
      systemInstruction += `\n\nUSER WORKOUT CONTEXT:\n${dbContext}\nUse this context to give highly personalized advice.`
    }

    return this.tryChatContent(key, systemInstruction, history, newMessage)
  }
}
