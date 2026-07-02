'use client'

import React, { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { saveGlobalSettings } from '@/actions/settings'

type Exercise = Database['public']['Tables']['exercises']['Row']

export default function ClientAdminPage({ 
  initialExercises, 
  initialSettings 
}: { 
  initialExercises: Exercise[],
  initialSettings: any[]
}) {
  const [exercises, setExercises] = useState(initialExercises)
  const [settings, setSettings] = useState(initialSettings)
  const [geminiApiKey, setGeminiApiKey] = useState(settings.find(s => s.key === 'gemini_api_key')?.value || '')
  const [userLimit, setUserLimit] = useState(settings.find(s => s.key === 'user_registration_limit')?.value || 100)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      await saveGlobalSettings({
        geminiApiKey,
        userRegistrationLimit: Number(userLimit)
      })
      alert('Settings saved successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Tabs.Root defaultValue="exercises" className="flex flex-col w-full">
      <Tabs.List className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <Tabs.Trigger 
          value="exercises" 
          className="px-6 py-3 font-mono text-sm tracking-widest uppercase text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] transition-colors"
        >
          Exercises
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="settings" 
          className="px-6 py-3 font-mono text-sm tracking-widest uppercase text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] transition-colors"
        >
          Settings
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="exercises" className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-mono uppercase tracking-widest">Exercise Library</h2>
          <Button className="bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 font-bold uppercase tracking-widest text-xs">
            + New Exercise
          </Button>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">ID</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Name</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Muscle Group</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Difficulty</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.id} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-mono text-zinc-500">{ex.id}</td>
                  <td className="p-4 font-medium">{ex.name}</td>
                  <td className="p-4 text-zinc-500 capitalize">{ex.muscle_group}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${
                      ex.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      ex.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {ex.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="text-xs uppercase tracking-widest h-8 px-3">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tabs.Content>

      <Tabs.Content value="settings" className="space-y-6">
        <h2 className="text-xl font-bold font-mono uppercase tracking-widest">Global Settings</h2>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Gemini API Key</label>
            <input 
              type="password" 
              value={geminiApiKey}
              onChange={e => setGeminiApiKey(e.target.value)}
              placeholder="AI_xxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B35]/50 transition-colors font-mono" 
            />
            <p className="text-xs text-zinc-500">Used for AI-powered workout insights and coaching.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">User Registration Limit</label>
            <input 
              type="number" 
              value={userLimit}
              onChange={e => setUserLimit(e.target.value)}
              className="w-full max-w-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF6B35]/50 transition-colors font-mono" 
            />
            <p className="text-xs text-zinc-500">Maximum number of users allowed to register (0 for unlimited).</p>
          </div>

          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 font-bold uppercase tracking-widest text-xs mt-4 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}
