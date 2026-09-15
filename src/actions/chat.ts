'use server'

import { AIService } from '@/services/ai-service'
import { createClient } from '@/lib/supabase/server'

export async function sendChatMessage(history: { role: string; content: string }[], newMessage: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let contextStr = ""
    if (user) {
      // Last 10 workouts with full set/weight data for progressive overload context
      const { data: recentWorkouts } = await supabase
        .from('workouts_v5')
        .select(`
          id, name, start_time, xp_earned, sets_skipped, exercises_skipped,
          workout_exercises_v5 (
            exercise_name,
            exercises ( name, muscle_group ),
            workout_sets_v5 ( actual_reps, weight_kg, unit, completed )
          )
        `)
        .eq('profile_id', user.id)
        .order('start_time', { ascending: false })
        .limit(10)
        
      if (recentWorkouts && recentWorkouts.length > 0) {
        contextStr = `USER'S RECENT WORKOUT HISTORY (last ${recentWorkouts.length} sessions):\n`
        contextStr += (recentWorkouts as any[]).map((w: any) => {
          const date = new Date(w.start_time).toLocaleDateString()
          const header = `* ${w.name} (${date}) - skipped ${w.exercises_skipped} exercises, ${w.sets_skipped} sets`
          const exList = (w.workout_exercises_v5 || []).map((we: any) => {
            const exName = we.exercises?.name || we.exercise_name || 'Unknown'
            const muscle = we.exercises?.muscle_group ? ` [${we.exercises.muscle_group}]` : ''
            const sets = (we.workout_sets_v5 || [])
              .filter((s: any) => s.completed)
              .map((s: any) => {
                const weight = s.weight_kg ? `@${s.weight_kg}${s.unit || 'kg'}` : ''
                return `${s.actual_reps}reps${weight}`
              })
              .join(', ')
            return sets ? `  - ${exName}${muscle}: ${sets}` : `  - ${exName}${muscle}: (no weight logged)`
          }).join('\n')
          return `${header}\n${exList}`
        }).join('\n\n')
      }

      // Personal Records for progressive overload suggestions
      // `records` table may not be in generated types yet — cast via from() only
      const { data: records, error: recordsError } = await (supabase.from as (table: string) => ReturnType<typeof supabase.from>)('records')
        .select('exercise_id, exercises(name), max_reps, max_weight_kg, unit')
        .eq('user_id', user.id)
        .order('max_weight_kg', { ascending: false })
        .limit(20)

      if (recordsError) {
        console.warn('Failed to fetch PRs (non-fatal):', recordsError.message)
      }

      if (records && records.length > 0) {
        contextStr += `\n\nUSER'S PERSONAL RECORDS (PRs):\n`
        contextStr += (records as any[]).map((r: any) => {
          const name = r.exercises?.name || `Exercise #${r.exercise_id}`
          const weight = r.max_weight_kg ? `${r.max_weight_kg}${r.unit || 'kg'}` : 'bodyweight'
          return `* ${name}: ${r.max_reps} reps @ ${weight}`
        }).join('\n')
        contextStr += `\n\nUse this data to give SPECIFIC progressive overload advice (e.g., "Try adding 2.5kg to your bench press next session"). Reference actual exercise names and numbers.`
      }
    }

    const response = await AIService.chatWithFitnessAgent(history, newMessage, contextStr)
    return { success: true, response }
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return { success: false, error: error.message }
  }
}
