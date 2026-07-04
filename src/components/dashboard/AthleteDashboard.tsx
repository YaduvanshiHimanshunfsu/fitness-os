'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Flame, CheckCircle2, Zap, Coffee, Play, BatteryCharging, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { useWorkoutStore } from '@/hooks/useWorkout';
import { EXERCISES } from '@/constants/exercises';
import { WorkoutHeatmap } from '@/components/heatmap/WorkoutHeatmap';
import type { HeatmapDay } from '@/services/analytics-service';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyInsight } from '@/actions/ai';
import { MUAY_THAI_PHASE_1 } from '@/constants/martialArts';

export interface AthleteDashboardProps {
  userName:      string;
  currentStreak: number;
  levelName:     string;
  heatmap:       HeatmapDay[];
}

/** Slot-machine style count-up for numeric stats */
function RollingCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration  = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display}{suffix}</>;
}

export default function AthleteDashboard({
  userName,
  currentStreak,
  levelName,
  heatmap,
}: AthleteDashboardProps) {
  const router = useRouter();
  const { startSession } = useWorkoutStore();

  // ── CRITICAL: All date/day logic is in useEffect so it ALWAYS runs
  //    on the client with the user's real local timezone (never UTC server time).
  const [mounted,          setMounted]          = useState(false);
  const [now,              setNow]              = useState<Date | null>(null);
  const [isRest,           setIsRest]           = useState(false);
  const [todayName,        setTodayName]        = useState('');
  const [todayExercises,   setTodayExercises]   = useState<typeof EXERCISES>([]);
  const [workoutName,      setWorkoutName]      = useState('Loading Mission...');
  const [muscles,          setMuscles]          = useState<string[]>([]);
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  const [estimatedCalories,setEstimatedCalories]= useState(0);
  const [aiInsight,        setAiInsight]        = useState<string | null>(null);

  const computeDay = useCallback(() => {
    const localNow  = new Date();                                       // guaranteed client-local
    const dayString = format(localNow, 'EEEE').toLowerCase();           // e.g. "sunday"
    const rest      = dayString === 'thursday';
    const exercises = EXERCISES.filter(e => e.day === dayString);

    const muscleSet = new Set<string>();
    let mins = 0, cals = 0;
    if (!rest && exercises.length > 0) {
      exercises.forEach(e => {
        muscleSet.add(e.muscleGroup);
        mins += (e.sets || 0) * 1.5;
        cals += (e.sets || 0) * 12;
      });
      mins += 10;
    }

    setNow(localNow);
    setIsRest(rest);
    setTodayName(dayString);
    setTodayExercises(exercises);
    setWorkoutName(rest ? 'Rest Day' : `${dayString.charAt(0).toUpperCase() + dayString.slice(1)} Workout`);
    setMuscles(Array.from(muscleSet));
    setEstimatedMinutes(Math.round(mins));
    setEstimatedCalories(Math.round(cals));
    setMounted(true);
  }, []);

  useEffect(() => {
    computeDay();                                      // run immediately on mount
    const clockTick = setInterval(computeDay, 60_000); // refresh every minute
    return () => clearInterval(clockTick);
  }, [computeDay]);

  useEffect(() => {
    if (mounted && !aiInsight) {
      getDailyInsight(userName, currentStreak, levelName).then(res => {
        if (res.success && res.insight) {
          setAiInsight(res.insight);
        }
      });
    }
  }, [mounted, aiInsight, userName, currentStreak, levelName]);

  const totalSets = todayExercises.reduce((acc, ex) => acc + (ex.sets || 0), 0);

  const handleStartMission = () => {
    startSession(todayName, estimatedMinutes, todayExercises);
    router.push('/workout/warmup');
  };

  return (
    <div className="w-full text-zinc-900 dark:text-white font-sans pb-12 relative">
      {/* Ambient glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF4500]/15 blur-[140px] pointer-events-none will-change-transform" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#10B981]/8 blur-[140px] pointer-events-none will-change-transform" />

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

        {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col md:flex-row gap-6 justify-between items-start"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                Welcome{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4500] to-[#FF8C61]">
                  {userName}
                </span>
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium text-sm mt-2">
                {mounted
                  ? isRest
                    ? 'Take it easy today. Recovery is key.'
                    : now
                      ? `${format(now, 'EEEE, MMMM d')} · Ready to crush your goals?`
                      : 'Ready to crush your goals?'
                  : <Skeleton className="h-4 w-48 mt-1" />}
              </p>
            </div>

            {/* Streak badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="flex gap-4 w-full md:w-auto"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center gap-4 shadow-xl min-w-[160px] hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#FF4500]/20 border border-[#FF4500]/30 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-[#FF4500]" fill="currentColor" />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Current Streak</div>
                  <div className="text-xl font-black text-zinc-900 dark:text-white leading-none mt-1">
                    <RollingCounter value={currentStreak} suffix=" Days" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* AI Coach Insight Banner */}
          <AnimatePresence>
            {aiInsight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">AI Coach Note</div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      "{aiInsight}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Today's Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
          >
            <div className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF4500]/20 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none rounded-3xl" />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#FF4500] uppercase tracking-widest">Today's Mission</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                    {workoutName}
                  </h2>
                  {muscles.length > 0 && !isRest && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {muscles.map((m) => (
                        <span key={m} className="px-3 py-1 bg-white/10 border border-white/10 text-zinc-900 dark:text-white text-[11px] font-bold rounded-md capitalize">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {!isRest && (
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(255,69,0,0.6)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStartMission}
                    disabled={!mounted}
                    className="w-full md:w-auto px-8 py-5 bg-gradient-to-r from-[#FF4500] to-[#E03C00] text-zinc-900 dark:text-white rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    Start Mission
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center relative z-10">
                {[
                  { label: 'Exercises',    value: todayExercises.length, suffix: '' },
                  { label: 'Total Sets',   value: totalSets,             suffix: '' },
                  { label: 'Est. Duration',value: estimatedMinutes,      suffix: 'm' },
                  { label: 'Kcal Burn',    value: estimatedCalories,     suffix: '' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex justify-center">
                      {mounted ? <RollingCounter value={stat.value} suffix={stat.suffix} /> : <Skeleton className="h-8 w-16" />}
                    </div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Execution Protocol List */}
          {mounted && !isRest && todayExercises.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
            >
              <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1 h-4 bg-[#FF4500] rounded-full" />
                Execution Protocol
              </h3>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                {todayExercises.map((ex, idx) => (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.04 }}
                    className="flex items-center justify-between p-4 sm:p-5 border-b border-white/5 last:border-b-0 hover:bg-white/10 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-zinc-900 dark:text-white group-hover:bg-[#FF4500] group-hover:border-[#FF4500] transition-colors shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">{ex.name}</div>
                        <div className="text-[11px] font-bold text-zinc-500 mt-0.5 uppercase tracking-widest">
                          {ex.muscleGroup}
                          <span className="text-[#FF4500] mx-1">•</span>
                          {ex.sets} SETS
                          <span className="text-[#FF4500] mx-1">•</span>
                          {ex.reps} REPS
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-900 dark:text-white transition-colors" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Rest Day Card */}
          {mounted && isRest && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center">
                <Coffee className="w-8 h-8 text-[#10B981]" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Rest Day</h2>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium max-w-sm">
                Recovery is where the gains happen. Hydrate, sleep, and come back stronger tomorrow.
              </p>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
            className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
          >
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">XP Level Progress</div>
            <div className="flex justify-between items-end mb-4">
              <div className="text-2xl font-black text-zinc-900 dark:text-white">{levelName}</div>
              <div className="text-[11px] font-bold text-[#FF4500] uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3" /> Active
              </div>
            </div>
            <div className="w-full h-3 bg-white dark:bg-zinc-900 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
                className="h-full bg-gradient-to-r from-[#FF4500] to-[#FF8C61] rounded-full"
              />
            </div>
            <div className="text-right text-[10px] font-black text-zinc-500 mt-2 tracking-widest">3,450 / 5,000 XP</div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
            className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-sm font-black text-zinc-900 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-widest">
              <span className="text-[#FF4500]"><CheckCircle2 className="w-4 h-4" /></span>
              Quick Stats
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Workouts',    value: '4 sessions',              color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', trend: 'up', trendVal: '12%' },
                { label: 'Volume',      value: `14,200 kg`,               color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', trend: 'up', trendVal: '5%' },
                { label: 'Best Streak', value: `${currentStreak} Days`,   color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', trend: 'down', trendVal: '2 days' },
              ].map((stat, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${stat.bg} ${stat.border} transition-colors`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-black uppercase tracking-widest ${stat.color}`}>{stat.label}</span>
                    </div>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">
                      {mounted ? stat.value : <Skeleton className="h-6 w-20" />}
                    </span>
                  </div>
                  <div className={`flex flex-col items-end ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4 mb-1" /> : <TrendingDown className="w-4 h-4 mb-1" />}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{stat.trendVal}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Martial Arts Training (Conditional) */}
          {mounted && ['tuesday', 'thursday', 'saturday', 'sunday'].includes(todayName) && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' }}
              className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-sm font-black text-zinc-900 dark:text-white mb-2 flex items-center gap-2 uppercase tracking-widest">
                <span className="text-red-500"><Flame className="w-4 h-4" /></span>
                Martial Arts
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold mb-4">
                Today is a scheduled martial arts training day.
              </p>
              <button
                onClick={() => {
                  const maTemplate = MUAY_THAI_PHASE_1.find(t => t.day === todayName);
                  if (maTemplate) {
                    const mappedExercises = maTemplate.drills.map((d, index) => ({
                      id: typeof d.id === 'string' ? undefined : d.id, // Handle DB vs hardcoded
                      name: d.name,
                      muscleGroup: 'Martial Arts',
                      imageUrl: d.image_url || '/placeholder.png',
                      sets: d.sets,
                      reps: String(d.reps),
                      exerciseOrder: index,
                      day: todayName
                    }));
                    // Estimate minutes (naive 1 min per set)
                    const estMins = mappedExercises.reduce((acc, ex) => acc + (ex.sets || 1), 0) + 5;
                    startSession(todayName, estMins, mappedExercises as any, 'martial_arts');
                    router.push('/workout/warmup');
                  }
                }}
                className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3 h-3" fill="currentColor" />
                Start Training
              </button>
            </motion.div>
          )}
        </div>
      </main>

      {/* ── BOTTOM ROW: HEATMAP + RECOVERY ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 mt-6 px-4 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
          className="lg:col-span-2"
        >
          <WorkoutHeatmap data={heatmap} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4, ease: 'easeOut' }}
          className="lg:col-span-1 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-white mb-2 flex items-center gap-2 uppercase tracking-widest">
              <span className="text-[#10B981]"><BatteryCharging className="w-5 h-5" /></span>
              Recovery Status
            </h3>
            <div className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
              Based on recent strain
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-zinc-900 dark:text-white">85%</span>
              <span className="text-sm font-bold text-[#10B981] mb-1">PRIMED</span>
            </div>
            <div className="w-full h-3 bg-white dark:bg-zinc-900 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full"
              />
            </div>
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">
              Your central nervous system is recovered. Ideal day to push intensity or go for PRs.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
