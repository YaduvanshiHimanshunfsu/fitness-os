'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'
import { deleteRoutineExercise } from '@/actions/routines'
import { AuxiliaryRoutineModal } from './AuxiliaryRoutineModal'

export function AuxiliaryRoutineAdmin({ initialRoutines }: { initialRoutines: any[] }) {
  const [routines, setRoutines] = useState(initialRoutines)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [routineToEdit, setRoutineToEdit] = useState<any | null>(null)
  
  // Group by category, but also just allow adding anything
  const [activeCategory, setActiveCategory] = useState<'warmup' | 'cooldown' | 'posture' | 'knockknee'>('warmup')

  const currentRoutine = routines.find(r => r.category === activeCategory)
  const currentExercises = currentRoutine?.auxiliary_routine_exercises || []

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) return
    
    const res = await deleteRoutineExercise(id)
    if (res.success) {
      setRoutines(routines.map(r => {
        if (r.category === activeCategory) {
          return {
            ...r,
            auxiliary_routine_exercises: r.auxiliary_routine_exercises.filter((ex: any) => ex.id !== id)
          }
        }
        return r
      }))
    } else {
      alert(res.error || 'Failed to delete exercise')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
          {['warmup', 'cooldown', 'posture', 'knockknee'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${activeCategory === cat ? 'bg-white dark:bg-zinc-800 text-[#FF6B35] shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <Button 
          onClick={() => { setRoutineToEdit({ routine_category: activeCategory }); setIsModalOpen(true); }}
          className="bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 font-bold uppercase tracking-widest text-xs"
        >
          + Add to {activeCategory}
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Order</th>
              <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Name</th>
              <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase">Duration/Sets</th>
              <th className="p-4 font-mono font-bold tracking-widest text-xs text-zinc-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentExercises.map((ex: any) => (
              <tr key={ex.id} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-mono text-zinc-500">{ex.exercise_order}</td>
                <td className="p-4 font-medium">{ex.name}</td>
                <td className="p-4 text-zinc-500">
                  {ex.duration_seconds ? `${ex.duration_seconds} sec` : ''}
                  {ex.sets && ex.reps ? ` | ${ex.sets} x ${ex.reps}` : ''}
                </td>
                <td className="p-4 text-right flex justify-end gap-2 items-center h-full">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => { setRoutineToEdit({ ...ex, routine_category: activeCategory }); setIsModalOpen(true); }}
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
            {currentExercises.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono text-sm">
                  No exercises found for {activeCategory}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AuxiliaryRoutineModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          window.location.reload() 
        }}
        exerciseToEdit={routineToEdit}
      />
    </div>
  )
}
