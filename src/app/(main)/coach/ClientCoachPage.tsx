'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot, Loader2 } from 'lucide-react'
import { sendChatMessage } from '@/actions/chat'

interface Message {
  id: string
  role: 'user' | 'model'
  content: string
}

export default function ClientCoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! I am your elite FITNESS OS AI Coach. I'm here to help you crush your goals. Ask me anything about exercise, diet, nutrition, or recovery."
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    // Prepare history for Gemini API (excluding the welcome message to save tokens, or mapping it)
    const history = newMessages
      .filter(m => m.id !== 'welcome') // optional: exclude initial greeting
      .slice(0, -1) // exclude the message we just sent
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await sendChatMessage(history, userMsg.content)
      if (res.success && res.response) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: res.response
        }])
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: res.error || "Sorry, I encountered an unexpected error. Please try again."
        }])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const suggestionChips = [
    "What should I eat before a workout?",
    "Fix my deadlift form",
    "How to avoid overtraining?"
  ]

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col pt-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF4500] to-[#FF8C61] flex items-center justify-center shadow-lg shadow-[#FF4500]/20">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-widest">AI Coach</h1>
          <p className="text-sm font-medium text-[#FF4500]">Powered by Gemini</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white/5 dark:bg-zinc-900/50 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-800' : 'bg-gradient-to-br from-[#FF4500] to-[#FF8C61]'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                
                <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tr-none' 
                    : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF4500] to-[#FF8C61] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#FF4500] animate-spin" />
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Typing...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl border-t border-zinc-200 dark:border-white/5">
          {messages.length === 1 && (
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {suggestionChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => {
                    setInput(chip)
                  }}
                  className="whitespace-nowrap px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask your coach anything..."
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition-all text-sm text-zinc-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 w-10 h-10 rounded-full bg-[#FF4500] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E03C00] transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
