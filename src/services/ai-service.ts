/**
 * AI Service — Gemini integration for FITNESS OS
 *
 * Model selection strategy:
 *   - Use only stable, production-grade models (no experimental/preview variants)
 *   - Order: fastest+cheapest first, highest-quality last as fallback
 *   - Remove googleSearchRetrieval (adds latency, not needed for workout coaching)
 *
 * Key: reads GEMINI_API_KEY from Vercel env var only (never from DB)
 */
import { GoogleGenerativeAI } from '@google/generative-ai'

// ─── Stable model list (fastest/cheapest → most capable) ──────────────────────
// Removed: gemini-2.0-pro-exp-02-05, gemini-2.0-flash-lite-preview-02-05 (experimental)
// Removed: gemini-1.0-pro, gemini-pro (deprecated)
const MODELS_IN_ORDER = [
  'gemini-2.5-flash',        // Primary: fast, cheap, excellent quality
  'gemini-2.5-pro',          // Best quality — fallback if flash unavailable
  'gemini-2.0-flash',        // Stable Gen-2 fallback
  'gemini-1.5-flash-latest', // Reliable last resort
  'gemini-1.5-pro',          // Heavy fallback (slower, higher cost)
] as const

type GeminiModel = (typeof MODELS_IN_ORDER)[number]

export class AIService {
  private static async getGeminiKey(): Promise<string | null> {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY
    console.warn('[AIService] GEMINI_API_KEY environment variable is not set.')
    return null
  }

  /**
   * Try multiple Gemini models for single-turn content generation.
   * No search grounding — workout coaching doesn't need live web data.
   */
  private static async tryGenerateContent(
    key: string,
    prompt: string
  ): Promise<string> {
    const genAI = new GoogleGenerativeAI(key)
    let lastError: Error | null = null

    for (const modelName of MODELS_IN_ORDER) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName as string })
        const result = await model.generateContent(prompt)
        return result.response.text().trim()
      } catch (error: unknown) {
        lastError = error as Error
        const msg = ((error as Error)?.message ?? '').toLowerCase()

        // Retry next model on: not found, quota, rate limit, deprecation
        if (
          msg.includes('404') ||
          msg.includes('not found') ||
          msg.includes('not supported') ||
          msg.includes('deprecated') ||
          msg.includes('429') ||
          msg.includes('quota') ||
          msg.includes('too many requests')
        ) {
          console.warn(`[AIService] Model ${modelName} unavailable (${msg.slice(0, 60)}), trying next…`)
          continue
        }

        // Fatal errors (bad key, invalid request body) — don't retry
        throw error
      }
    }

    throw lastError ?? new Error('All Gemini models failed')
  }

  /**
   * Try multiple Gemini models for multi-turn chat with system instruction.
   * No search grounding — reduces latency and avoids 400 errors on free tier.
   */
  private static async tryChatContent(
    key: string,
    systemInstruction: string,
    history: { role: string; content: string }[],
    newMessage: string
  ): Promise<string> {
    const genAI = new GoogleGenerativeAI(key)
    let lastError: Error | null = null

    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }))

    for (const modelName of MODELS_IN_ORDER) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName as string,
          systemInstruction,
        })
        const chat = model.startChat({ history: chatHistory })
        const result = await chat.sendMessage([{ text: newMessage }])
        return result.response.text().trim()
      } catch (error: unknown) {
        lastError = error as Error
        const msg = ((error as Error)?.message ?? '').toLowerCase()

        if (
          msg.includes('404') ||
          msg.includes('not found') ||
          msg.includes('not supported') ||
          msg.includes('deprecated') ||
          msg.includes('429') ||
          msg.includes('quota') ||
          msg.includes('too many requests')
        ) {
          console.warn(`[AIService] Chat model ${modelName} unavailable (${msg.slice(0, 60)}), trying next…`)
          continue
        }

        throw error
      }
    }

    throw lastError ?? new Error('All Gemini chat models failed')
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  public static async generateDailyInsight(
    userName: string,
    currentStreak: number,
    activeLevel: string
  ): Promise<string> {
    const key = await this.getGeminiKey()
    if (!key) throw new Error('AI Coach is not configured. Set GEMINI_API_KEY in Vercel Environment Variables.')

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
    if (!key) throw new Error('AI Coach is not configured. Set GEMINI_API_KEY in Vercel Environment Variables.')

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
    dbContext = ''
  ): Promise<string> {
    const key = await this.getGeminiKey()
    if (!key) throw new Error('AI Coach is not configured. Set GEMINI_API_KEY in Vercel Environment Variables.')

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
