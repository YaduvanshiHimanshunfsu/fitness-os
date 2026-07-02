'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, GripVertical, Trash2, Edit2, Check, X } from 'lucide-react'
import { addTemplateExercise, updateTemplateExercise, deleteTemplateExercise, updateTemplateFocus } from '@/actions/templates'

export function ScheduleBuilder({ templates, exercises }: { templates: any[], exercises: any[] }) {
  const [selectedDay, setSelectedDay] = useState(templates[0]?.id || null)
  
  const currentTemplate = templates.find(t => t.id === selectedDay)
  const templateExercises = currentTemplate?.workout_template_exercises || []

  const [isEditingFocus, setIsEditingFocus] = useState(false)
  const [focusInput, setFocusInput] = useState('')

  const [editingExercise, setEditingExercise] = useState<number | null>(null)
  const [setsInput, setSetsInput] = useState(3)
  const [repsInput, setRepsInput] = useState('10')

  const [isAdding, setIsAdding] = useState(false)
  const [newExerciseId, setNewExerciseId] = useState<number | null>(null)

  const handleSaveFocus = async () => {
    if (!currentTemplate) return
    await updateTemplateFocus(currentTemplate.id, focusInput)
    setIsEditingFocus(false)
    window.location.reload()
  }

  const handleAddExercise = async () => {
    if (!currentTemplate || !newExerciseId) return
    const order = templateExercises.length + 1
    await addTemplateExercise(currentTemplate.id, newExerciseId, 3, '10', order)
    setIsAdding(false)
    window.location.reload()
  }

  const handleSaveExerciseEdit = async (id: number) => {
    await updateTemplateExercise(id, { sets: setsInput, reps: repsInput })
    setEditingExercise(null)
    window.location.reload()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this exercise from the schedule?')) return
    await deleteTemplateExercise(id)
    window.location.reload()
  }

  return (
    <div className="flex gap-6 items-start">
      <div className="w-48 flex flex-col gap-2 shrink-0">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedDay(t.id)}
            className={`text-left px-4 py-3 rounded-lg font-mono text-sm tracking-widest uppercase transition-colors ${
              selectedDay === t.id 
                ? 'bg-[#FF6B35] text-white font-bold' 
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {t.day}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        {currentTemplate && (
          <>
            <div className="mb-6 flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-xl font-bold font-mono uppercase tracking-widest">{currentTemplate.name}</h3>
                
                {isEditingFocus ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="text" 
                      value={focusInput} 
                      onChange={e => setFocusInput(e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-sm font-mono"
                    />
                    <button onClick={handleSaveFocus} className="text-green-500 hover:text-green-600"><Check size={16}/></button>
                    <button onClick={() => setIsEditingFocus(false)} className="text-red-500 hover:text-red-600"><X size={16}/></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-zinc-500 text-sm font-mono">{currentTemplate.focus}</p>
                    <button onClick={() => { setFocusInput(currentTemplate.focus); setIsEditingFocus(true); }} className="text-zinc-400 hover:text-zinc-600">
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>
              <Button onClick={() => setIsAdding(true)} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 font-bold uppercase tracking-widest text-xs">
                + Add Exercise
              </Button>
            </div>

            <div className="space-y-3">
              {templateExercises.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 font-mono text-sm uppercase tracking-widest">
                  No exercises for this day.
                </div>
              ) : (
                templateExercises.sort((a: any, b: any) => a.exercise_order - b.exercise_order).map((te: any) => (
                  <div key={te.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                      <GripVertical size={16} className="text-zinc-400 cursor-grab" />
                      <div>
                        <h4 className="font-bold text-sm uppercase">{te.exercises?.name}</h4>
                        <p className="text-xs text-zinc-500 font-mono">{te.exercises?.muscle_group}</p>
                      </div>
                    </div>
                    
                    {editingExercise === te.id ? (
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-500 font-mono uppercase">Sets</label>
                        <input type="number" value={setsInput} onChange={e => setSetsInput(Number(e.target.value))} className="w-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-xs" />
                        <label className="text-xs text-zinc-500 font-mono uppercase ml-2">Reps</label>
                        <input type="text" value={repsInput} onChange={e => setRepsInput(e.target.value)} className="w-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-xs" />
                        <button onClick={() => handleSaveExerciseEdit(te.id)} className="ml-2 text-green-500 hover:text-green-600"><Check size={16}/></button>
                        <button onClick={() => setEditingExercise(null)} className="text-red-500 hover:text-red-600"><X size={16}/></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-mono text-sm font-bold">{te.sets} <span className="text-zinc-500 font-normal">sets</span></div>
                          <div className="font-mono text-sm font-bold">{te.reps} <span className="text-zinc-500 font-normal">reps</span></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => {
                            setSetsInput(te.sets)
                            setRepsInput(te.reps)
                            setEditingExercise(te.id)
                          }} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(te.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {isAdding && (
                <div className="p-4 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-lg flex items-center justify-between mt-4">
                  <select 
                    onChange={e => setNewExerciseId(Number(e.target.value))}
                    className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 text-sm font-mono mr-4 focus:outline-none focus:border-[#FF6B35]"
                  >
                    <option value="">Select an exercise...</option>
                    {exercises.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscle_group})</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <Button onClick={handleAddExercise} disabled={!newExerciseId} className="bg-[#FF6B35] text-white hover:bg-[#FF8C61] text-xs font-bold uppercase tracking-widest">Add</Button>
                    <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-zinc-500">Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
