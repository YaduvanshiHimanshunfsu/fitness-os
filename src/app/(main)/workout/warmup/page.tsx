import { WireframeWarmup } from '@/components/workout/WireframeWarmup';
import { getRoutineExercises } from '@/actions/routines';

export default async function WarmupPage() {
  const dbRoutine = await getRoutineExercises('warmup');

  return (
    <WireframeWarmup 
      exercises={dbRoutine?.exercises.length ? dbRoutine.exercises : undefined}
      image={dbRoutine?.routine?.image_url || undefined}
      nextRoute="/workout/session"
    />
  );
}
