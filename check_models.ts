import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent("hello")
    console.log("gemini-1.5-flash worked:", result.response.text())
  } catch (e: any) {
    console.log("gemini-1.5-flash failed:", e.message)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
    const result = await model.generateContent("hello")
    console.log("gemini-1.5-pro worked:", result.response.text())
  } catch (e: any) {
    console.log("gemini-1.5-pro failed:", e.message)
  }
}

run()
