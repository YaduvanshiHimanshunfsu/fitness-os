'use server'

import { AIService } from '@/services/ai-service'
import { createClient } from '@/lib/supabase/server'

export async function sendChatMessage(history: { role: string; content: string }[], newMessage: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let contextStr = ""
    if (user) {
      // Get recent workouts
      const { data: recentWorkouts } = await supabase
        .from('workouts_v5')
        .select(`
          id, name, start_time, xp_earned, sets_skipped, exercises_skipped,
          workout_exercises_v5 (
            exercises ( name ),
            workout_sets_v5 ( actual_reps, weight_kg, completed )
          )
        `)
        .eq('profile_id', user.id)
        .order('start_time', { ascending: false })
        .limit(3)
        
      if (recentWorkouts && recentWorkouts.length > 0) {
        contextStr = `Here is the user's recent workout history:\n` + (recentWorkouts as any[]).map(w => {
          const wStr = `- ${w.name} on ${new Date(w.start_time).toLocaleDateString()}: Skipped ${w.exercises_skipped} exercises and ${w.sets_skipped} sets. `
          const exList = (w.workout_exercises_v5 || []).map((we: any) => {
            const exName = we.exercises?.name || 'Unknown Exercise'
            const sets = we.workout_sets_v5 || []
            const completedSets = sets.filter((s: any) => s.completed).length
            const totalSets = sets.length
            return `${exName} (${completedSets}/${totalSets} sets)`
          }).join(', ')
          return wStr + `Exercises: ${exList}`
        }).join('\n')
      }
    }

    const response = await AIService.chatWithFitnessAgent(history, newMessage, contextStr)
    return { success: true, response }
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return { success: false, error: error.message }
  }
}
