import ClientSchedulePage from './ClientSchedulePage'
import { EXERCISES } from '@/constants/exercises'

export default async function SchedulePage() {
  // Build day-grouped structure from EXERCISES constant (no DB dependency).
  // This is the same source of truth as the Dashboard — always correct.
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const templates = days.map(day => ({
    day,
    workout_template_exercises: EXERCISES
      .filter(ex => ex.day === day)
      .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
      .map(ex => ({
        id: ex.id,
        sets: ex.sets,
        reps: ex.reps,
        exercise_order: ex.exerciseOrder,
        exercises: {
          id: ex.id,
          name: ex.name,
          muscle_group: ex.muscleGroup,
          image_url: ex.imageUrl,
        }
      }))
  }))

  return <ClientSchedulePage templates={templates} />
}
