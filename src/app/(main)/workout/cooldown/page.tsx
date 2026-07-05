import ClientCooldownPage from './ClientCooldownPage';
import { getRoutineExercises } from '@/actions/routines';

export const dynamic = 'force-dynamic';

export default async function CoolDownPage() {
  const dbRoutine = await getRoutineExercises('cooldown');

  return (
    <ClientCooldownPage 
      exercises={dbRoutine?.exercises?.length ? dbRoutine.exercises : undefined}
      image={dbRoutine?.routine?.image_url || undefined}
    />
  );
}
