'use client'

import React, { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { saveGlobalSettings } from '@/actions/settings'
import { ExerciseModal } from '@/components/admin/ExerciseModal'
import { MartialArtsModal } from '@/components/admin/MartialArtsModal'
import { deleteExercise } from '@/actions/exercises'
import { deleteMartialArtsExercise } from '@/actions/martialArts'
import { deleteMuscleFocusExercise } from '@/actions/muscleFocus'
import { Edit2, Trash2 } from 'lucide-react'
import { ScheduleBuilder } from '@/components/admin/ScheduleBuilder'
import { MuscleFocusModal } from '@/components/admin/MuscleFocusModal'
import { AuxiliaryRoutineAdmin } from '@/components/admin/AuxiliaryRoutineAdmin'

type Exercise = Database['public']['Tables']['exercises']['Row']

export default function ClientAdminPage({ 
  initialExercises, 
  initialSettings,
  initialLogs,
  initialTemplates,
  initialMartialArts,
  initialMuscleFocus,
  initialAuxiliaryRoutines
}: { 
  initialExercises: Exercise[],
  initialSettings: any[],
  initialLogs: any[],
  initialTemplates: any[],
  initialMartialArts: any[],
  initialMuscleFocus: any[],
  initialAuxiliaryRoutines: any[]
}) {
  const [exercises, setExercises] = useState(initialExercises)
  const [martialArts, setMartialArts] = useState(initialMartialArts)
  const [muscleFocus, setMuscleFocus] = useState(initialMuscleFocus)
  const [settings, setSettings] = useState(initialSettings)
  const [logs, setLogs] = useState(initialLogs)
  const [geminiApiKey, setGeminiApiKey] = useState(settings.find(s => s.key === 'gemini_api_key')?.value || '')
  const [userLimit, setUserLimit] = useState(settings.find(s => s.key === 'user_registration_limit')?.value || 100)
  const [useDbMartialArts, setUseDbMartialArts] = useState(settings.find(s => s.key === 'use_db_martial_arts')?.value === 'true' || settings.find(s => s.key === 'use_db_martial_arts')?.value === true)
  const [useDbMuscleFocus, setUseDbMuscleFocus] = useState(settings.find(s => s.key === 'use_db_muscle_focus')?.value === 'true' || settings.find(s => s.key === 'use_db_muscle_focus')?.value === true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null)

  const [isMartialArtsModalOpen, setIsMartialArtsModalOpen] = useState(false)
  const [martialArtsToEdit, setMartialArtsToEdit] = useState<any | null>(null)
  
  const [isMuscleFocusModalOpen, setIsMuscleFocusModalOpen] = useState(false)
  const [muscleFocusToEdit, setMuscleFocusToEdit] = useState<any | null>(null)

  const supabase = createClient()

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      await saveGlobalSettings({
        geminiApiKey,
        userRegistrationLimit: Number(userLimit),
        useDbMartialArts,
        useDbMuscleFocus
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

  const handleDeleteMartialArts = async (id: number) => {
    if (!confirm('Are you sure you want to delete this technique? This action cannot be undone.')) return
    
    const res = await deleteMartialArtsExercise(id)
    if (res.success) {
      setMartialArts(martialArts.filter(ma => ma.id !== id))
    } else {
      alert(res.error || 'Failed to delete martial arts exercise')
    }
  }

  const handleDeleteMuscleFocus = async (id: number) => {
    if (!confirm('Are you sure you want to delete this focus exercise? This action cannot be undone.')) return
    
    const res = await deleteMuscleFocusExercise(id)
    if (res.success) {
      setMuscleFocus(muscleFocus.filter(mf => mf.id !== id))
    } else {
      alert(res.error || 'Failed to delete muscle focus exercise')
    }
  }

  return (
    <Tabs.Root defaultValue="exercises" className="flex flex-col w-full">
      <Tabs.List className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 flex-wrap">
        <Tabs.Trigger 
          value="exercises" 
          className="px-6 py-3 font-mono text-sm tracking-widest uppercase text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] transition-colors"
        >
          Exercises
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="martial-arts" 
          className="px-6 py-3 font-mono text-sm tracking-widest uppercase text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] transition-colors"
        >
          Martial Arts
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="muscle-focus" 
          className="px-6 py-3 font-mono text-sm tracking-widest uppercase text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] transition-colors"
        >
          Muscle Focus
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="auxiliary-routines" 
          className="px-6 py-3 font-mono text-sm tracking-widest uppercase text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] transition-colors"
        >
          Auxiliary Routines
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="schedule" 
          className="px-6 py-3 font-mono text-sm tracking-widest uppercase text-zinc-500 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] transition-colors"
        >
          Daily Schedule
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

      <Tabs.Content value="martial-arts" className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-mono uppercase tracking-widest">Martial Arts Library</h2>
          <Button 
            onClick={() => { setMartialArtsToEdit(null); setIsMartialArtsModalOpen(true); }}
            className="bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 font-bold uppercase tracking-widest text-xs"
          >
            + New Technique
          </Button>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Image</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Name</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Sets/Reps</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Rest</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {martialArts.map((ma) => (
                <tr key={ma.id} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    {ma.image_url ? (
                      <img src={ma.image_url} alt={ma.name} className="w-10 h-10 object-cover rounded bg-zinc-100 dark:bg-zinc-800" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-mono">N/A</div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{ma.name}</td>
                  <td className="p-4 text-zinc-500">
                    {ma.default_sets || '-'} x {ma.default_reps || '-'}
                  </td>
                  <td className="p-4 text-zinc-500">{ma.default_rest_time || '-'}</td>
                  <td className="p-4 text-right flex justify-end gap-2 items-center h-full pt-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { setMartialArtsToEdit(ma); setIsMartialArtsModalOpen(true); }}
                      className="text-xs uppercase tracking-widest h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteMartialArts(ma.id)}
                      className="text-xs uppercase tracking-widest h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {martialArts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 font-mono text-sm">
                    No techniques found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Tabs.Content>

      <Tabs.Content value="muscle-focus" className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-mono uppercase tracking-widest">Muscle Focus Library</h2>
          <Button 
            onClick={() => { setMuscleFocusToEdit(null); setIsMuscleFocusModalOpen(true); }}
            className="bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 font-bold uppercase tracking-widest text-xs"
          >
            + New Focus Exercise
          </Button>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Image</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Name</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Instruction</th>
                <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {muscleFocus.map((mf) => (
                <tr key={mf.id} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    {mf.image_url ? (
                      <img src={mf.image_url} alt={mf.name} className="w-10 h-10 object-cover rounded bg-zinc-100 dark:bg-zinc-800" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 font-mono">N/A</div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{mf.name}</td>
                  <td className="p-4 text-zinc-500 truncate max-w-xs">{mf.instruction || '-'}</td>
                  <td className="p-4 text-right flex justify-end gap-2 items-center h-full pt-6">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { setMuscleFocusToEdit(mf); setIsMuscleFocusModalOpen(true); }}
                      className="text-xs uppercase tracking-widest h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteMuscleFocus(mf.id)}
                      className="text-xs uppercase tracking-widest h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {muscleFocus.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-sm">
                    No focus exercises found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Tabs.Content>

      <Tabs.Content value="auxiliary-routines" className="space-y-4">
        <h2 className="text-xl font-bold font-mono uppercase tracking-widest mb-4">Auxiliary Routines (Warmup, Cooldown...)</h2>
        <AuxiliaryRoutineAdmin initialRoutines={initialAuxiliaryRoutines} />
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

          <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Data Source Toggles</h3>
            <p className="text-xs text-zinc-500 max-w-2xl">Toggle whether Martial Arts and Muscle Focus modules should use their default Hardcoded constants or use the dynamic Database-driven data managed in this command center.</p>
            
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 max-w-xl">
              <div>
                <p className="text-sm font-bold">Martial Arts System</p>
                <p className="text-xs text-zinc-500">Currently using {useDbMartialArts ? 'Database' : 'Hardcoded Defaults'}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={useDbMartialArts} onChange={(e) => setUseDbMartialArts(e.target.checked)} />
                <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#FF6B35]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 max-w-xl">
              <div>
                <p className="text-sm font-bold">Muscle Focus System</p>
                <p className="text-xs text-zinc-500">Currently using {useDbMuscleFocus ? 'Database' : 'Hardcoded Defaults'}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={useDbMuscleFocus} onChange={(e) => setUseDbMuscleFocus(e.target.checked)} />
                <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#FF6B35]"></div>
              </label>
            </div>
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

      <Tabs.Content value="schedule" className="space-y-4">
        <h2 className="text-xl font-bold font-mono uppercase tracking-widest mb-4">Daily Schedule Builder</h2>
        <ScheduleBuilder templates={initialTemplates} exercises={exercises} />
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
          window.location.reload() 
        }}
        exerciseToEdit={exerciseToEdit}
      />
      <MartialArtsModal 
        isOpen={isMartialArtsModalOpen}
        onClose={() => {
          setIsMartialArtsModalOpen(false)
          window.location.reload() 
        }}
        exerciseToEdit={martialArtsToEdit}
      />
      <MuscleFocusModal 
        isOpen={isMuscleFocusModalOpen}
        onClose={() => {
          setIsMuscleFocusModalOpen(false)
          window.location.reload() 
        }}
        exerciseToEdit={muscleFocusToEdit}
      />
    </Tabs.Root>
  )
}
