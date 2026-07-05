import { POSTURE_EXERCISES, POSTURE_IMAGE } from '@/constants/posture-routine';
import { WireframeRoutine } from '@/components/workout/WireframeRoutine';
import { getRoutineExercises } from '@/actions/routines';

export const dynamic = 'force-dynamic';
export default async function PosturePage() {
  const dbRoutine = await getRoutineExercises('posture');

  return (
    <WireframeRoutine 
      title="Posture Routine"
      exercises={dbRoutine?.exercises?.length ? dbRoutine.exercises : POSTURE_EXERCISES}
      imageUrl={dbRoutine?.routine?.image_url || POSTURE_IMAGE}
      nextRoute="/workout/knockknee"
    />
  );
}
