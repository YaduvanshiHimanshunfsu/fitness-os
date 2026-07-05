'use client';

/**
 * SummaryPage — post-workout result screen
 *
 * ⚠ Rules of Hooks (React):
 *   Every hook (useState, useEffect, useMemo, useCallback, …) MUST be called
 *   unconditionally, in the exact same order, on every render.
 *   There must be NO early returns / conditionals BEFORE all hook calls.
 *
 *   This file has been carefully structured so that:
 *     1. All hooks are called first.
 *     2. All derived values are computed inside useMemo.
 *     3. Only AFTER all hooks is there a conditional loading guard.
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import { WireframeSummary }                      from '@/components/workout/WireframeSummary';
import { useWorkoutStore }                       from '@/hooks/useWorkout';
import { EXERCISES }                             from '@/constants/exercises';
import { createClient }                          from '@/lib/supabase/client';

export default function SummaryPage() {

  // ─────────────────────────────────────────────────────────────────────────
  // 1. ALL HOOKS — must come before any conditional return
  // ─────────────────────────────────────────────────────────────────────────

  const {
    completedSets,
    skippedItems,
    startTime,
    day,
    estimatedMinutes,
    todayExercises,
    finishSession,
  } = useWorkoutStore();

  const [mounted, setMounted] = useState(false);
  const [streak,  setStreak]  = useState(0);

  // Stable reference to "now" captured once when the component first mounts.
  // Using a ref so it never changes across re-renders (unlike useState/useMemo).
  const mountTimeRef = useRef<Date>(new Date());

  // ── Derived session times ─────────────────────────────────────────────────
  const rawStartTime = useMemo(() => {
    return startTime ? new Date(startTime) : new Date(mountTimeRef.current.getTime() - 45 * 60_000);
  }, [startTime]);

  const rawEndTime = mountTimeRef.current;

  const durationMinutes = useMemo(
    () => Math.max(1, Math.round((rawEndTime.getTime() - rawStartTime.getTime()) / 60_000)),
    [rawStartTime, rawEndTime],
  );

  // ── Exercise plan for today ───────────────────────────────────────────────
  const todayDay = useMemo(
    () => (day || new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()),
    [day],
  );

  const planExercises = useMemo(
    () => todayExercises.length > 0 ? todayExercises : EXERCISES.filter(e => e.day === todayDay),
    [todayExercises, todayDay],
  );

  // ── Computed totals ───────────────────────────────────────────────────────
  const totalExercises = planExercises.length;

  const totalSets = useMemo(
    () => planExercises.reduce((acc, ex) => acc + (ex.sets || 0), 0),
    [planExercises],
  );

  const setsCompleted = useMemo(
    () => completedSets.filter(s => s.completed).length,
    [completedSets],
  );

  const exercisesCompleted = useMemo(
    () => new Set(completedSets.filter(s => s.completed).map(s => s.exerciseId)).size,
    [completedSets],
  );

  const completionPercent = useMemo(
    () => totalSets > 0 ? Math.min(100, Math.round((setsCompleted / totalSets) * 100)) : 0,
    [setsCompleted, totalSets],
  );

  const calories = useMemo(
    () => Math.round(setsCompleted * 4.5 + durationMinutes * 3.2),
    [setsCompleted, durationMinutes],
  );

  const muscleVolume = useMemo(() => {
    const muscleMap: Record<string, number> = {};
    completedSets.forEach(set => {
      if (set.completed) {
        const ex = planExercises.find(exercise => exercise.id === set.exerciseId);
        if (ex) {
          const m = ex.muscleGroup.toUpperCase();
          muscleMap[m] = (muscleMap[m] || 0) + set.actualReps;
        }
      }
    });
    return Object.entries(muscleMap)
      .map(([name, reps]) => ({ name, reps }))
      .sort((a, b) => b.reps - a.reps);
  }, [completedSets, planExercises]);

  // ── Formatting strings ────────────────────────────────────────────────────
  const dateStr      = mountTimeRef.current.toLocaleDateString('en-GB',  { day: '2-digit', month: 'long', year: 'numeric' });
  const dayStr       = mountTimeRef.current.toLocaleDateString('en-US',  { weekday: 'long' });
  const startTimeStr = rawStartTime.toLocaleTimeString('en-US',          { hour: '2-digit', minute: '2-digit' });
  const endTimeStr   = rawEndTime.toLocaleTimeString('en-US',            { hour: '2-digit', minute: '2-digit' });

  // ── Computed achievements ─────────────────────────────────────────────────
  const achievements = useMemo(() => {
    const list: string[] = [];
    if (completionPercent === 100) list.push('Perfect Workout 💯');
    if (durationMinutes < (estimatedMinutes || 55) && (estimatedMinutes || 55) > 0) list.push('Speed Demon ⚡');
    if (setsCompleted >= 20) list.push('Set Machine 🔥');
    return list;
  }, [completionPercent, durationMinutes, estimatedMinutes, setsCompleted]);

  // ─────────────────────────────────────────────────────────────────────────
  // 2. SIDE EFFECTS — all effects below, still before any conditional return
  // ─────────────────────────────────────────────────────────────────────────

  // Fetch live streak + set mounted flag
  useEffect(() => {
    let cancelled = false;

    const fetchStreak = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !cancelled) {
          const { data } = await supabase.from('streaks')
            .select('current_streak')
            .eq('user_id', user.id)
            .single();
          if (data && !cancelled) setStreak(data.current_streak ?? 0);
        }
      } catch {
        /* silent — streak defaults to 0 */
      }
    };

    fetchStreak().then(() => {
      if (!cancelled) setMounted(true);
    });

    return () => { cancelled = true; };
  }, []); // ← empty deps: fires exactly once on mount

  // Persist completion score to the workout store.
  // Guarded with `mounted` inside the effect body so it only runs after the
  // initial paint — this prevents the infinite-loop that was crashing the page.
  useEffect(() => {
    if (!mounted) return;         // no-op on the first (pre-hydration) pass
    finishSession(completionPercent);
     
  }, [mounted]);                  // intentionally only depends on mounted

  // ─────────────────────────────────────────────────────────────────────────
  // 3. CONDITIONAL RENDERING — safe to do now that all hooks have been called
  // ─────────────────────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A] flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-[#FF4500]/20 border-t-[#FF4500] animate-spin"
          aria-label="Loading your session summary…"
        />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. FULL RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <WireframeSummary
        date={dateStr}
        day={dayStr}
        startTime={startTimeStr}
        endTime={endTimeStr}
        rawStartTime={rawStartTime}
        rawEndTime={rawEndTime}
        duration={durationMinutes}
        estimatedMinutes={estimatedMinutes || 55}
        streak={streak}
        completionPercent={completionPercent}
        calories={calories}
        exercisesCompleted={exercisesCompleted}
        totalExercises={totalExercises}
        setsCompleted={setsCompleted}
        totalSets={totalSets}
        skippedItems={skippedItems}
        achievements={achievements}
        muscleVolume={muscleVolume}
      />
    </div>
  );
}
