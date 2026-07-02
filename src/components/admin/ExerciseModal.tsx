'use client'

import React, { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, UploadCloud, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { addExercise, updateExercise } from '@/actions/exercises'

type Exercise = Database['public']['Tables']['exercises']['Row']

interface ExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  exerciseToEdit?: Exercise | null
}

export function ExerciseModal({ isOpen, onClose, exerciseToEdit }: ExerciseModalProps) {
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('')
  const [difficulty, setDifficulty] = useState('beginner')
  const [instructions, setInstructions] = useState('')
  const [mistakes, setMistakes] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (exerciseToEdit) {
      setName(exerciseToEdit.name)
      setMuscleGroup(exerciseToEdit.muscle_group)
      setDifficulty(exerciseToEdit.difficulty)
      setInstructions(exerciseToEdit.instructions || '')
      setMistakes(exerciseToEdit.common_mistakes || '')
      setImageUrl(exerciseToEdit.image_url || '')
    } else {
      // Reset form
      setName('')
      setMuscleGroup('')
      setDifficulty('beginner')
      setInstructions('')
      setMistakes('')
      setImageUrl('')
    }
  }, [exerciseToEdit, isOpen])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('exercise_images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('exercise_images')
        .getPublicUrl(filePath)

      setImageUrl(data.publicUrl)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      name,
      muscle_group: muscleGroup.toLowerCase(),
      difficulty,
      instructions,
      common_mistakes: mistakes,
      image_url: imageUrl
    }

    let res
    if (exerciseToEdit) {
      res = await updateExercise(exerciseToEdit.id, payload)
    } else {
      res = await addExercise(payload)
    }

    setIsSaving(false)
    if (res.success) {
      onClose()
    } else {
      alert(res.error || 'Failed to save exercise')
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl bg-white dark:bg-[#0D0D0D] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 md:p-8 z-50 flex flex-col max-h-[90vh] focus:outline-none">
          <div className="flex justify-between items-center mb-6 shrink-0">
            <Dialog.Title className="text-xl font-black font-mono tracking-widest text-zinc-900 dark:text-white uppercase">
              {exerciseToEdit ? 'Edit Exercise' : 'New Exercise'}
            </Dialog.Title>
            <Dialog.Close className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Exercise Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35]/50 transition-colors font-medium text-zinc-900 dark:text-white" placeholder="e.g. Barbell Squat" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Muscle Group</label>
                <input required value={muscleGroup} onChange={e => setMuscleGroup(e.target.value)} type="text" className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35]/50 transition-colors font-medium text-zinc-900 dark:text-white" placeholder="e.g. Legs" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35]/50 transition-colors font-medium text-zinc-900 dark:text-white appearance-none">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Instructions (Markdown OK)</label>
              <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={4} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35]/50 transition-colors font-medium text-zinc-900 dark:text-white resize-none" placeholder="1. Stand with feet shoulder-width apart..." />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Common Mistakes</label>
              <textarea value={mistakes} onChange={e => setMistakes(e.target.value)} rows={2} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B35]/50 transition-colors font-medium text-zinc-900 dark:text-white resize-none" placeholder="- Knees caving in&#10;- Rounding the lower back" />
            </div>

            <div className="space-y-2 pb-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Demonstration Image</label>
              <div className="flex items-center gap-4">
                {imageUrl ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImageUrl('')} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="w-full max-w-sm h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 transition-colors">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                    ) : (
                      <>
                        <UploadCloud className="w-6 h-6 text-zinc-400 mb-2" />
                        <span className="text-xs font-medium text-zinc-500">Click to upload</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                )}
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="sticky bottom-0 pt-4 bg-white dark:bg-[#0D0D0D] border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 mt-auto shrink-0">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 disabled:opacity-50 transition-colors flex items-center gap-2">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {exerciseToEdit ? 'Save Changes' : 'Create Exercise'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
