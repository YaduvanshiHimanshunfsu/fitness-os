'use client'

import React, { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { saveGlobalSettings } from '@/actions/settings'
import { ExerciseModal } from '@/components/admin/ExerciseModal'
import { deleteExercise } from '@/actions/exercises'
import { Edit2, Trash2 } from 'lucide-react'

type Exercise = Database['public']['Tables']['exercises']['Row']

export default function ClientAdminPage({ 
  initialExercises, 
  initialSettings,
  initialLogs
}: { 
  initialExercises: Exercise[],
  initialSettings: any[],
  initialLogs: any[]
}) {
  const [exercises, setExercises] = useState(initialExercises)
  const [settings, setSettings] = useState(initialSettings)
  const [logs, setLogs] = useState(initialLogs)
  const [geminiApiKey, setGeminiApiKey] = useState(settings.find(s => s.key === 'gemini_api_key')?.value || '')
  const [userLimit, setUserLimit] = useState(settings.find(s => s.key === 'user_registration_limit')?.value || 100)
  const [isSaving, setIsSaving] = useState(false)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null)
  
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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) return
    
    const res = await deleteExercise(id)
    if (res.success) {
      setExercises(exercises.filter(ex => ex.id !== id))
    } else {
      alert(res.error || 'Failed to delete exercise')
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
        <Tabs.Trigger 
          value="logs" 
          className="px-6 py-3 font-mono text-sm tracking-widest uppercase text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] transition-colors"
        >
          Audit Logs
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="exercises" className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-mono uppercase tracking-widest">Exercise Library</h2>
          <Button 
            onClick={() => { setExerciseToEdit(null); setIsModalOpen(true); }}
            className="bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 font-bold uppercase tracking-widest text-xs"
          >
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
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { setExerciseToEdit(ex); setIsModalOpen(true); }}
                      className="text-xs uppercase tracking-widest h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(ex.id)}
                      className="text-xs uppercase tracking-widest h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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

      <Tabs.Content value="logs" className="space-y-4">
        <h2 className="text-xl font-bold font-mono uppercase tracking-widest mb-4">Admin Audit Logs</h2>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Timestamp</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Admin</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Action</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-mono text-zinc-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{log.profiles?.name || 'Unknown'}</div>
                    <div className="text-xs text-zinc-500">{log.profiles?.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded text-[10px] font-bold uppercase tracking-widest">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-zinc-500 max-w-xs truncate">
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-sm">
                    No logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Tabs.Content>

      <ExerciseModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          // To get updated exercises immediately without hard reload, we can trigger a router refresh
          window.location.reload() 
        }}
        exerciseToEdit={exerciseToEdit}
      />
    </Tabs.Root>
  )
}
