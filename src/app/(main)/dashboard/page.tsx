import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AthleteDashboard from '@/components/dashboard/AthleteDashboard';
import { getTodayDay, isRestDay } from '@/utils/date-utils';
import { EXERCISES } from '@/constants/exercises';
import { getLevelFromXP } from '@/utils/level-calculator';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Profile
  const { data: profile } = await (supabase.from('profiles') as any).select('*').eq('id', user.id).single();
  
  // Fetch Streak
  const { data: streak } = await (supabase.from('streaks') as any).select('*').eq('user_id', user.id).single();
  
  // Workout of the Day Data
  const rest = isRestDay();
  const todayName = getTodayDay();
  const todayExercises = EXERCISES.filter(e => e.day === todayName);
  
  let workoutName = rest ? 'Rest Day' : `${todayName.charAt(0).toUpperCase() + todayName.slice(1)} Workout`;
  const muscles = new Set<string>();
  let estimatedMinutes = 0;
  let estimatedCalories = 0;

  if (!rest && todayExercises.length > 0) {
    todayExercises.forEach(e => {
      muscles.add(e.muscleGroup);
      estimatedMinutes += e.sets * 1.5;
      estimatedCalories += e.sets * 12;
    });
    estimatedMinutes += 10;
  }

  const { current: currentLevel } = getLevelFromXP(profile?.xp_total || 0);

  return (
    <AthleteDashboard 
      userName={profile?.name || 'Athlete'}
      workoutName={workoutName}
      muscles={Array.from(muscles)}
      currentStreak={streak?.current_streak || 0}
      levelName={currentLevel.name}
      estimatedMinutes={Math.round(estimatedMinutes)}
      estimatedCalories={Math.round(estimatedCalories)}
      todayExercises={todayExercises}
      isRest={rest}
    />
  );
}
