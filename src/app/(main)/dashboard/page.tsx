import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AthleteDashboard from '@/components/dashboard/AthleteDashboard';
import { getLevelFromXP } from '@/utils/level-calculator';
import { getHeatmapData } from '@/services/analytics-service';
import { getMartialArtsTemplates } from '@/actions/martialArts';
import { getCachedSettings } from '@/services/cache-service';
import { MUAY_THAI_PHASE_1 } from '@/constants/martialArts';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Profile, Streak, Heatmap, and Templates in parallel
  const [{ data: profile }, { data: streak }, heatmap, martialArtsTemplates, settings] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('streaks').select('current_streak, best_streak, last_workout_date').eq('user_id', user.id).single(),
    getHeatmapData(user.id, 90),
    getMartialArtsTemplates(),
    getCachedSettings()
  ]);

  const safeSettings = settings || [];
  const useDb = safeSettings.find((s: any) => s.key === 'use_db_martial_arts')?.value === 'true' || safeSettings.find((s: any) => s.key === 'use_db_martial_arts')?.value === true;

  let templatesToUse = MUAY_THAI_PHASE_1;
  if (useDb && martialArtsTemplates && martialArtsTemplates.length > 0) {
    templatesToUse = martialArtsTemplates as any;
  }

  const { current: currentLevel } = getLevelFromXP(profile?.xp_total || 0);

  return (
    <AthleteDashboard 
      userName={profile?.name || 'Athlete'}
      currentStreak={streak?.current_streak || 0}
      levelName={currentLevel?.name || 'White Belt'}
      heatmap={heatmap}
      martialArtsTemplates={templatesToUse}
    />
  );
}
