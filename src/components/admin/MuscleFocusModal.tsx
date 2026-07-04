'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, UploadCloud, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { addMuscleFocusExercise, updateMuscleFocusExercise } from '@/actions/muscleFocus'

export function MuscleFocusModal({
  isOpen,
  onClose,
  exerciseToEdit,
}: {
  isOpen: boolean
  onClose: () => void
  exerciseToEdit: any | null
}) {
  const [name, setName] = useState('')
  const [instruction, setInstruction] = useState('')
  const [comment, setComment] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (exerciseToEdit) {
      setName(exerciseToEdit.name)
      setInstruction(exerciseToEdit.instruction || '')
      setComment(exerciseToEdit.comment || '')
      setImageUrl(exerciseToEdit.image_url || '')
    } else {
      setName('')
      setInstruction('')
      setComment('')
      setImageUrl('')
    }
  }, [exerciseToEdit, isOpen])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `muscle-focus/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('exercise_images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('exercise_images')
        .getPublicUrl(filePath)

      setImageUrl(data.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
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
      instruction,
      comment,
      image_url: imageUrl,
    }

    let res
    if (exerciseToEdit) {
      res = await updateMuscleFocusExercise(exerciseToEdit.id, payload)
    } else {
      res = await addMuscleFocusExercise(payload)
    }

    setIsSaving(false)
    if (res.success) {
      onClose()
    } else {
      alert(res.error || 'Failed to save muscle focus exercise')
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 z-50 max-h-[90vh] overflow-y-auto shadow-2xl">
          
          <div className="flex justify-between items-center mb-8">
            <Dialog.Title className="text-xl font-bold font-mono uppercase tracking-widest text-zinc-900 dark:text-white">
              {exerciseToEdit ? 'Edit Focus Exercise' : 'New Focus Exercise'}
            </Dialog.Title>
            <Dialog.Close className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Image Upload */}
            <div>
              <label className="block text-xs font-mono font-bold tracking-widest uppercase text-zinc-500 mb-2">
                Exercise Image (Optional)
              </label>
              <div className="flex items-center gap-4">
                {imageUrl ? (
                  <div className="relative w-24 h-24 rounded-lg bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-center overflow-hidden">
                    <img src={imageUrl} alt="Preview" className="max-w-full max-h-full object-contain p-2" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black text-white rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-[#FF6B35] dark:hover:border-[#FF6B35] flex items-center justify-center transition-colors group cursor-pointer overflow-hidden">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-zinc-400 group-hover:text-[#FF6B35] transition-colors" />
                    )}
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png,image/gif,image/webp" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs text-zinc-500">
                    Upload a JPG, PNG, or GIF.<br/>
                    Will be stored in Supabase `exercise_images` bucket.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold tracking-widest uppercase text-zinc-500 mb-2">
                  Exercise Name
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B35] transition-colors text-zinc-900 dark:text-white"
                  placeholder="e.g. Bench Press"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold tracking-widest uppercase text-zinc-500 mb-2">
                  Instruction
                </label>
                <textarea
                  value={instruction}
                  onChange={e => setInstruction(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B35] transition-colors text-zinc-900 dark:text-white min-h-[80px]"
                  placeholder="e.g. Keep your back straight..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold tracking-widest uppercase text-zinc-500 mb-2">
                  Comment / Details
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B35] transition-colors text-zinc-900 dark:text-white"
                  placeholder="e.g. Focus on chest contraction"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-widest uppercase text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-widest uppercase bg-[#FF6B35] hover:bg-[#FF8C61] text-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {exerciseToEdit ? 'Save Changes' : 'Create Exercise'}
              </button>
            </div>
          </form>
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
