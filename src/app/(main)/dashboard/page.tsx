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

  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const [
    { data: profile },
    { data: streak },
    heatmap,
    martialArtsTemplates,
    settings,
    { data: recentWorkouts },
    { count: totalWorkoutsCount },
  ] = await Promise.all([
    supabase.from('profiles').select('id, name, avatar_url, xp_total').eq('id', user.id).single(),
    supabase.from('streaks').select('current_streak, best_streak, last_workout_date').eq('user_id', user.id).single(),
    getHeatmapData(user.id, 90),
    getMartialArtsTemplates(),
    getCachedSettings(),
    supabase
      .from('workouts_v5')
      .select('start_time, end_time, workout_exercises_v5(workout_sets_v5(completed))')
      .eq('profile_id', user.id)
      .gte('start_time', fortyEightHoursAgo)
      .order('start_time', { ascending: false }),
    supabase.from('workouts_v5').select('*', { count: 'exact', head: true }).eq('profile_id', user.id),
  ]);

  const safeSettings = settings || [];
  const useDb =
    safeSettings.find((s: any) => s.key === 'use_db_martial_arts')?.value === 'true' ||
    safeSettings.find((s: any) => s.key === 'use_db_martial_arts')?.value === true;

  let templatesToUse = MUAY_THAI_PHASE_1;
  if (useDb && martialArtsTemplates && martialArtsTemplates.length > 0) {
    templatesToUse = martialArtsTemplates as any;
  }

  const totalXP = profile?.xp_total || 0;
  const { current: currentLevel, next: nextLevel, xpToNext } = getLevelFromXP(totalXP);
  const xpIntoCurrentLevel = totalXP - (currentLevel?.xpRequired || 0);
  const xpRangeForLevel = nextLevel ? nextLevel.xpRequired - (currentLevel?.xpRequired || 0) : 1;
  const xpProgressPercent = Math.min(100, Math.round((xpIntoCurrentLevel / xpRangeForLevel) * 100));

  let setsLast48h = 0;
  let durationLast48hMins = 0;
  for (const w of recentWorkouts ?? []) {
    if (w.start_time && w.end_time) {
      durationLast48hMins += Math.round(
        (new Date(w.end_time).getTime() - new Date(w.start_time).getTime()) / 60000
      );
    }
    for (const we of (w as any).workout_exercises_v5 || []) {
      setsLast48h += ((we as any).workout_sets_v5 || []).filter((s: any) => s.completed).length;
    }
  }
  const recoveryScore = Math.round(100 - (Math.min(setsLast48h, 60) / 60) * 60);
  const recoveryLabel =
    recoveryScore >= 80 ? 'PRIMED' :
    recoveryScore >= 60 ? 'READY' :
    recoveryScore >= 40 ? 'MODERATE' : 'FATIGUED';

  return (
    <AthleteDashboard
      userName={profile?.name || 'Athlete'}
      currentStreak={streak?.current_streak || 0}
      bestStreak={streak?.best_streak || 0}
      totalWorkouts={totalWorkoutsCount || 0}
      levelName={currentLevel?.name || 'Beginner'}
      levelColor={currentLevel?.color || '#94a3b8'}
      totalXP={totalXP}
      xpForNextLevel={nextLevel?.xpRequired || totalXP}
      xpProgressPercent={xpProgressPercent}
      xpToNext={xpToNext}
      recoveryScore={recoveryScore}
      recoveryLabel={recoveryLabel}
      heatmap={heatmap}
      martialArtsTemplates={templatesToUse}
    />
  );
}
