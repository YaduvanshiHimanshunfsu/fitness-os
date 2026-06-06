import { KNOCKKNEE_EXERCISES, KNOCKKNEE_IMAGE } from '@/constants/knockknee-routine';
import { WireframeRoutine } from '@/components/workout/WireframeRoutine';

export default function KnockKneePage() {
  return (
    <WireframeRoutine 
      title="Knock Knee Correction"
      exercises={KNOCKKNEE_EXERCISES}
      imageUrl={KNOCKKNEE_IMAGE}
      nextRoute="/workout/cooldown"
    />
  );
}
