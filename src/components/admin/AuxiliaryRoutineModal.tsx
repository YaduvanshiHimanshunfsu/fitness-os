'use client'

import React, { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { addRoutineExercise, updateRoutineExercise } from '@/actions/routines'
import { Button } from '@/components/ui/button'

export function AuxiliaryRoutineModal({ 
  isOpen, 
  onClose, 
  exerciseToEdit 
}: { 
  isOpen: boolean
  onClose: () => void
  exerciseToEdit: any | null
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!exerciseToEdit?.id
  const category = exerciseToEdit?.routine_category || 'warmup'

  const [formData, setFormData] = useState({
    name: '',
    duration_seconds: 30,
    reps: '',
    sets: 0,
    exercise_order: 1
  })

  useEffect(() => {
    if (isOpen && exerciseToEdit) {
      setFormData({
        name: exerciseToEdit.name || '',
        duration_seconds: exerciseToEdit.duration_seconds || 0,
        reps: exerciseToEdit.reps || '',
        sets: exerciseToEdit.sets || 0,
        exercise_order: exerciseToEdit.exercise_order || 1
      })
    } else if (isOpen) {
      setFormData({
        name: '',
        duration_seconds: 30,
        reps: '',
        sets: 0,
        exercise_order: 1
      })
    }
  }, [isOpen, exerciseToEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (isEditing) {
        const res = await updateRoutineExercise(exerciseToEdit.id, formData)
        if (res.success) onClose()
        else alert(res.error)
      } else {
        const res = await addRoutineExercise({
          ...formData,
          routine_category: category
        })
        if (res.success) onClose()
        else alert(res.error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-[#111111] p-6 md:p-8 rounded-3xl shadow-xl z-50 border border-zinc-200 dark:border-[#1F1F1F]">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold font-mono tracking-widest uppercase">
              {isEditing ? `Edit ${category} Exercise` : `Add ${category} Exercise`}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Exercise Name</label>
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35] transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Duration (Seconds)</label>
                <input type="number" value={formData.duration_seconds} onChange={e => setFormData({ ...formData, duration_seconds: Number(e.target.value) })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35] transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Order (Number)</label>
                <input type="number" required value={formData.exercise_order} onChange={e => setFormData({ ...formData, exercise_order: Number(e.target.value) })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35] transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Sets (Optional)</label>
                <input type="number" value={formData.sets} onChange={e => setFormData({ ...formData, sets: Number(e.target.value) })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35] transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Reps (Optional)</label>
                <input placeholder="e.g. 10-15" value={formData.reps} onChange={e => setFormData({ ...formData, reps: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35] transition-colors" />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" className="uppercase tracking-widest text-xs">Cancel</Button>
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting} className="bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 uppercase tracking-widest text-xs font-bold">
                {isSubmitting ? 'Saving...' : 'Save Exercise'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
