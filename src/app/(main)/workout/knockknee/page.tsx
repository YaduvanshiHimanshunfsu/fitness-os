import { KNOCKKNEE_EXERCISES, KNOCKKNEE_IMAGE } from '@/constants/knockknee-routine';
import { WireframeRoutine } from '@/components/workout/WireframeRoutine';
import { getRoutineExercises } from '@/actions/routines';

export default async function KnockKneePage() {
  const dbRoutine = await getRoutineExercises('knockknee');

  return (
    <WireframeRoutine 
      title="Knock Knee Correction"
      exercises={dbRoutine?.exercises?.length ? dbRoutine.exercises : KNOCKKNEE_EXERCISES}
      imageUrl={dbRoutine?.routine?.image_url || KNOCKKNEE_IMAGE}
      nextRoute="/workout/cooldown"
    />
  );
}
