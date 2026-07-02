import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AthleteDashboard from '@/components/dashboard/AthleteDashboard';
import { getLevelFromXP } from '@/utils/level-calculator';
import { getHeatmapData } from '@/services/analytics-service';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Profile, Streak, and Heatmap in parallel
  const [{ data: profile }, { data: streak }, heatmap] = await Promise.all([
    supabase.from().select('*').eq('id', user.id).single(),
    supabase.from().select('current_streak').eq('id', user.id).single(),
    getHeatmapData(user.id, 90),
  ]);

  const { current: currentLevel } = getLevelFromXP(profile?.xp_total || 0);

  return (
    <AthleteDashboard 
      userName={profile?.name || 'Athlete'}
      currentStreak={streak?.current_streak || 0}
      levelName={currentLevel.name}
      heatmap={heatmap}
    />
  );
}
