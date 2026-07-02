'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Trophy, Clock, Flame, CheckSquare, Zap, AlertTriangle,
  CheckCircle2, XCircle, Save, Home, Sparkles, Timer
} from 'lucide-react';
import { saveWorkoutSession } from '@/actions/workout';
import { useWorkoutStore, SkippedItem } from '@/hooks/useWorkout';
import { useNotifications } from '@/hooks/useNotifications';
import confetti from 'canvas-confetti';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { getPostWorkoutSummary } from '@/actions/ai';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedValue({
  value,
  suffix = '',
  duration = 1200,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now() + delay;
    let raf: number;

    const tick = (now: number) => {
      if (now < startTime) { raf = requestAnimationFrame(tick); return; }
      const progress = Math.min((now - startTime) / duration, 1);
      const eased    = 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, delay]);

  return (
    <div ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  numericValue,
  suffix,
  Icon,
  colorClass,
  bgClass,
  delay,
}: {
  label: string;
  value?: string;
  numericValue?: number;
  suffix?: string;
  Icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/[0.07] transition-colors group"
    >
      <div className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center`}>
        <Icon className={`w-4.5 h-4.5 ${colorClass}`} />
      </div>
      <div>
        <div className={`text-2xl sm:text-3xl font-black tracking-tight ${colorClass}`}>
          {numericValue !== undefined ? (
            <AnimatedValue value={numericValue} suffix={suffix || ''} delay={delay * 1000} />
          ) : (
            value
          )}
        </div>
        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────
export interface WireframeSummaryProps {
  date:                string;
  day:                 string;
  startTime:           string;
  endTime:             string;
  rawStartTime:        Date;
  rawEndTime:          Date;
  duration:            number;      // actual minutes taken
  estimatedMinutes:    number;      // planned duration
  streak:              number;
  completionPercent:   number;
  calories:            number;
  exercisesCompleted:  number;
  totalExercises:      number;
  setsCompleted:       number;
  totalSets:           number;
  skippedItems:        SkippedItem[];
  achievements:        string[];
  muscleVolume:        { name: string; reps: number }[];
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function WireframeSummary({
  date,
  day,
  startTime,
  endTime,
  rawStartTime,
  rawEndTime,
  duration,
  estimatedMinutes,
  streak,
  completionPercent,
  calories,
  exercisesCompleted,
  totalExercises,
  setsCompleted,
  totalSets,
  skippedItems,
  achievements,
  muscleVolume,
}: WireframeSummaryProps) {
  const router = useRouter();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const { completedSets, reset } = useWorkoutStore();
  const { addNotification }      = useNotifications();

  // ── AI Coach Note Fetching ─────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    getPostWorkoutSummary(duration, calories, muscleVolume).then(res => {
      if (mounted && res.success && res.summary) {
        setAiSummary(res.summary);
      }
    });
    return () => { mounted = false; };
  }, [duration, calories, muscleVolume]);

  // ── Confetti burst on mount ──────────────────────────────────────────────
  useEffect(() => {
    const end = Date.now() + 3000;
    const colors = ['#FF4500', '#FF8C61', '#10B981', '#F59E0B', '#6366F1'];

    const burst = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors,
        zIndex: 9999,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors,
        zIndex: 9999,
      });
      if (Date.now() < end) requestAnimationFrame(burst);
    };
    burst();
  }, []);

  // ── Save handler ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (saveState !== 'idle') return;
    setSaveState('saving');

    try {
      const result = await saveWorkoutSession({
        day,
        startTime:       rawStartTime,
        endTime:         rawEndTime,
        completedSets:   completedSets,
        completionScore: completionPercent,
      });

      setSaveState('saved');

      // Push success to notification bell
      addNotification({
        type:    'success',
        title:   'Your record saved! 🎉',
        message: `${day} workout logged. +${result.xpEarned} XP earned. Streak: ${result.newStreak} days.`,
      });

      if (result.newRecordsHit) {
        addNotification({
          type:    'success',
          title:   'New PR! 🚀',
          message: `You beat your previous 1RM volume today! Keep up the progressive overload!`,
        });
        
        // Extra PR confetti
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 },
          colors: ['#FF4500', '#F59E0B', '#10B981'],
        });
      }

      // Extra confetti on save
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FF4500', '#10B981', '#F59E0B'],
      });

      // Give user a moment to see "Saved!" then redirect
      setTimeout(() => {
        reset();
        router.push('/dashboard');
        router.refresh(); // Force Next.js to re-fetch server data
      }, 1800);
    } catch (err: any) {
      setSaveState('error');
      addNotification({
        type:    'error',
        title:   'Save Failed',
        message: err?.message || 'Could not save your session. Please try again.',
      });
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  // ── Time delta vs estimate ───────────────────────────────────────────────
  const timeDiff  = duration - estimatedMinutes;
  const fasterBy  = timeDiff < 0 ? Math.abs(timeDiff) : null;
  const slowerBy  = timeDiff > 0 ? timeDiff : null;
  const timeProgress = Math.min(100, (duration / (estimatedMinutes || 1)) * 100);

  // ── XP Earned ────────────────────────────────────────────────────────────
  // Base XP = 50. Bonus based on completion percent and time efficiency
  const baseXP = 50;
  const completionXP = Math.round((completionPercent / 100) * 100);
  const efficiencyXP = fasterBy ? fasterBy * 2 : 0;
  const totalXPEarned = baseXP + completionXP + efficiencyXP;

  const skippedExercises = skippedItems.filter((item, idx, arr) =>
    arr.findIndex(i => i.exerciseId === item.exerciseId) === idx
  );
  const skippedSets = skippedItems.filter(item => item.reason === 'skipped');

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A] flex flex-col items-center justify-center px-4 py-10 font-sans relative overflow-hidden">

      {/* Background glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#FF4500]/10 blur-[160px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#10B981]/8 blur-[160px] pointer-events-none" />

      <div className="w-full max-w-2xl flex flex-col gap-6 relative z-10">

        {/* ── Hero Header ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            className="w-24 h-24 bg-gradient-to-br from-[#FF4500] to-[#E03C00] rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(255,69,0,0.4)]"
          >
            <Trophy className="w-12 h-12 text-zinc-900 dark:text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight"
          >
            Congratulations!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg sm:text-xl font-semibold text-[#FF6B35] mt-2"
          >
            You did this — keep going!
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-500 font-medium mt-1 text-sm"
          >
            {date} &nbsp;·&nbsp; {startTime} → {endTime}
          </motion.p>
        </motion.div>

        {/* ── AI Coach Summary ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#FF4500]/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,69,0,0.3)]">
            <span className="text-xl">🤖</span>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-[#FF4500] uppercase tracking-widest mb-1">Coach's Note</div>
            {aiSummary ? (
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                "{aiSummary}"
              </p>
            ) : (
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Time Breakdown & XP Card ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF4500]/15 flex items-center justify-center shrink-0">
                <Timer className="w-6 h-6 text-[#FF4500]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                  Time Breakdown
                </div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <span className="text-xl font-black text-zinc-900 dark:text-white">{duration}m</span>
                    <span className="text-xs text-zinc-500 ml-1.5">actual</span>
                  </div>
                  <div>
                    <span className="text-xl font-black text-zinc-500">{estimatedMinutes}m</span>
                    <span className="text-xs text-zinc-600 ml-1.5">estimated</span>
                  </div>
                </div>
              </div>
              {fasterBy !== null && (
                <div className="bg-[#10B981]/15 border border-[#10B981]/25 rounded-xl px-3 py-2 text-center shrink-0">
                  <div className="text-[#10B981] font-black text-sm">{fasterBy}m</div>
                  <div className="text-[9px] font-bold text-[#10B981]/70 uppercase tracking-widest">Faster! 🚀</div>
                </div>
              )}
              {slowerBy !== null && (
                <div className="bg-[#F59E0B]/15 border border-[#F59E0B]/25 rounded-xl px-3 py-2 text-center shrink-0">
                  <div className="text-[#F59E0B] font-black text-sm">+{slowerBy}m</div>
                  <div className="text-[9px] font-bold text-[#F59E0B]/70 uppercase tracking-widest">Overtime</div>
                </div>
              )}
            </div>
            {/* Progress Bar for Time */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
              <div 
                className={`h-full ${timeProgress <= 100 ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} 
                style={{ width: `${Math.min(100, timeProgress)}%` }} 
              />
              {timeProgress > 100 && (
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${Math.min(100, timeProgress - 100)}%` }} 
                />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-gradient-to-br from-[#7C3AED]/20 to-[#6D28D9]/10 border border-[#8B5CF6]/30 rounded-2xl p-5 flex flex-col justify-center items-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            <Sparkles className="w-8 h-8 text-[#A78BFA] mb-2" />
            <div className="text-[10px] font-bold text-[#C4B5FD] uppercase tracking-widest mb-1">
              XP Earned
            </div>
            <div className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-baseline gap-1">
              +<AnimatedValue value={totalXPEarned} duration={1500} delay={800} />
              <span className="text-sm font-bold text-[#A78BFA]">XP</span>
            </div>
          </motion.div>
        </div>

        {/* ── Stats Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard
            label="Completion"
            numericValue={completionPercent}
            suffix="%"
            Icon={CheckSquare}
            colorClass="text-[#10B981]"
            bgClass="bg-[#10B981]/15"
            delay={0.4}
          />
          <StatCard
            label="Duration"
            numericValue={duration}
            suffix="m"
            Icon={Clock}
            colorClass="text-zinc-900 dark:text-white"
            bgClass="bg-white/10"
            delay={0.45}
          />
          <StatCard
            label="Calories"
            numericValue={calories}
            Icon={Flame}
            colorClass="text-[#FF4500]"
            bgClass="bg-[#FF4500]/15"
            delay={0.5}
          />
          <StatCard
            label="Streak"
            numericValue={streak}
            suffix=" Days"
            Icon={Zap}
            colorClass="text-[#F59E0B]"
            bgClass="bg-[#F59E0B]/15"
            delay={0.55}
          />
          <StatCard
            label={`Exercises (${totalExercises} total)`}
            numericValue={exercisesCompleted}
            Icon={CheckSquare}
            colorClass="text-zinc-900 dark:text-white"
            bgClass="bg-white/10"
            delay={0.6}
          />
          <StatCard
            label={`Sets (${totalSets} planned)`}
            numericValue={setsCompleted}
            Icon={CheckSquare}
            colorClass="text-zinc-900 dark:text-white"
            bgClass="bg-white/10"
            delay={0.65}
          />
        </div>

        {/* ── Volume Breakdown Chart ─────────────────────────────────────── */}
        {muscleVolume.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.68 }}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-5"
          >
            <h3 className="text-sm font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-widest">
              Volume Breakdown (Reps)
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={muscleVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#52525B" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    interval={0}
                    tickFormatter={(val) => val.substring(0, 4)}
                  />
                  <YAxis 
                    stroke="#52525B" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#18181B', border: '1px solid #3F3F46', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#FF4500' }}
                  />
                  <Bar dataKey="reps" radius={[4, 4, 0, 0]}>
                    {muscleVolume.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#FF4500' : '#52525B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ── Achievements ────────────────────────────────────────────────── */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-[#FF4500]/10 to-[#FF8C61]/5 border border-[#FF4500]/20 rounded-2xl p-5"
          >
            <h3 className="font-black text-xs text-[#FF4500] tracking-widest uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Achievements Unlocked
            </h3>
            <ul className="space-y-3">
              {achievements.map((a, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-sm text-zinc-900 dark:text-white">
                  <div className="w-7 h-7 rounded-full bg-[#FF4500] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,69,0,0.3)]">
                    <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-white" />
                  </div>
                  {a}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ── Skipped Exercises ────────────────────────────────────────────── */}
        {skippedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl p-5"
          >
            <h3 className="font-black text-xs text-[#F59E0B] tracking-widest uppercase mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Skipped Today
              <span className="ml-auto text-zinc-600 font-bold text-[10px]">
                {skippedItems.length} items
              </span>
            </h3>
            <ul className="space-y-2">
              {skippedItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 p-2 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <XCircle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.exerciseName}</span>
                  <span className="text-zinc-600 text-xs ml-auto">Set {item.setNumber}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ── Action Buttons ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 pb-6"
        >
          {/* Save Session Button */}
          <motion.button
            onClick={handleSave}
            disabled={saveState !== 'idle'}
            whileHover={saveState === 'idle' ? { scale: 1.02, boxShadow: '0 0 40px rgba(255,69,0,0.5)' } : {}}
            whileTap={saveState === 'idle' ? { scale: 0.97 } : {}}
            className={`flex-1 py-5 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
              saveState === 'saved'
                ? 'bg-[#10B981] text-zinc-900 dark:text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                : saveState === 'error'
                ? 'bg-red-500/80 text-zinc-900 dark:text-white'
                : saveState === 'saving'
                ? 'bg-[#FF4500]/60 text-zinc-900 dark:text-white cursor-wait'
                : 'bg-gradient-to-r from-[#FF4500] to-[#E03C00] text-zinc-900 dark:text-white shadow-lg shadow-[#FF4500]/20'
            }`}
          >
            <AnimatePresence mode="wait">
              {saveState === 'idle' && (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Session
                </motion.span>
              )}
              {saveState === 'saving' && (
                <motion.span
                  key="saving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Saving...
                </motion.span>
              )}
              {saveState === 'saved' && (
                <motion.span
                  key="saved"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Your Record Saved! Redirecting...
                </motion.span>
              )}
              {saveState === 'error' && (
                <motion.span
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Failed — Try Again
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Share Button */}
          <motion.button
            onClick={async () => {
              const url = `${window.location.origin}/api/og?score=${completionPercent}&duration=${duration}&day=${day}&streak=${streak}`;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: 'My Workout',
                    text: 'Check out my latest workout on FITNESS OS!',
                    url: url,
                  });
                } catch (err) {
                  navigator.clipboard.writeText(url);
                  addNotification({ type: 'success', title: 'Link copied to clipboard!' });
                }
              } else {
                navigator.clipboard.writeText(url);
                addNotification({ type: 'success', title: 'Link copied to clipboard!' });
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="sm:w-auto px-6 py-5 bg-[#FF4500]/10 hover:bg-[#FF4500]/20 border border-[#FF4500]/30 text-[#FF4500] hover:text-zinc-900 dark:text-white rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4" />
            Share
          </motion.button>

          {/* Skip to Dashboard */}
          <motion.button
            onClick={() => { reset(); router.push('/dashboard'); router.refresh(); }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="sm:w-auto px-6 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
