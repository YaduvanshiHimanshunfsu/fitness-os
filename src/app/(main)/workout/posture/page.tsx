import { POSTURE_EXERCISES, POSTURE_IMAGE } from '@/constants/posture-routine';
import { WireframeRoutine } from '@/components/workout/WireframeRoutine';

export default function PosturePage() {
  return (
    <WireframeRoutine 
      title="Posture Routine"
      exercises={POSTURE_EXERCISES}
      imageUrl={POSTURE_IMAGE}
      nextRoute="/workout/knockknee"
    />
  );
}
