'use server'

import { AIService } from '@/services/ai-service'

export async function sendChatMessage(history: { role: string; content: string }[], newMessage: string) {
  try {
    const response = await AIService.chatWithFitnessAgent(history, newMessage)
    return { success: true, response }
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return { success: false, error: error.message }
  }
}
