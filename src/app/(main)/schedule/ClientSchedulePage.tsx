'use client';

import React, { useState } from 'react';
import { ChevronDown, Calendar, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS_OF_WEEK = [
  { day: 'monday',    focus: 'Chest + Triceps' },
  { day: 'tuesday',   focus: 'Back + Biceps + Forearms' },
  { day: 'wednesday', focus: 'Legs + Athletic Strength' },
  { day: 'thursday',  focus: 'Rest Day / Active Recovery' },
  { day: 'friday',    focus: 'Shoulders + Chest + Triceps' },
  { day: 'saturday',  focus: 'Back + Chest + Arms' },
  { day: 'sunday',    focus: 'Full Body Athletic' },
];
// V7.0 has exactly 56 exercises across 6 active days
const V7_EXERCISE_COUNT = 56;

export default function ClientSchedulePage({ templates }: { templates: any[] }) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle');

  const triggerSeed = React.useCallback(() => {
    setIsSeeding(true);
    setSeedStatus('seeding');
    fetch('/api/admin/seed', { method: 'POST' })
      .then((res) => {
        if (res.ok) {
          setSeedStatus('done');
          setTimeout(() => window.location.reload(), 800);
        } else {
          console.error('Seed failed: Server returned', res.status);
          setSeedStatus('error');
          setIsSeeding(false);
        }
      })
      .catch(err => {
        console.error('Seed failed:', err);
        setSeedStatus('error');
        setIsSeeding(false);
      });
  }, []);

  React.useEffect(() => {
    // Count total exercises across all days in the DB
    const totalDbExercises = templates.reduce(
      (sum, t) => sum + (t.workout_template_exercises?.length || 0), 0
    );
    const needsReseed = totalDbExercises !== V7_EXERCISE_COUNT;

    if (needsReseed && !isSeeding) {
      triggerSeed();
    }
  }, [templates, isSeeding, triggerSeed]);

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 md:p-10 pb-32">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2A160F] border border-[#FF6B35]/20 rounded-md mb-4">
            <Calendar className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF6B35] uppercase">
              Weekly Routine
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-zinc-900 dark:text-white uppercase">
            All Exercises
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-medium">
            Review your full weekly workout schedule and muscle focus days.
          </p>
          {/* Sync status banner */}
          {seedStatus === 'seeding' && (
            <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-amber-400 text-sm font-bold tracking-wide">Syncing V7.0 exercise data... Please wait.</span>
            </div>
          )}
          {seedStatus === 'done' && (
            <div className="mt-4 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="text-green-400 text-sm font-bold tracking-wide">✓ Exercise library updated! Reloading...</span>
            </div>
          )}
          {seedStatus === 'error' && (
            <div className="mt-4 flex items-center justify-between px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-red-400 text-sm font-bold tracking-wide">Sync failed. Click to retry.</span>
              <button onClick={triggerSeed} className="text-xs font-bold uppercase tracking-widest bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                Retry Sync
              </button>
            </div>
          )}
          {seedStatus === 'idle' && (
            <button
              onClick={triggerSeed}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-[#FF6B35] transition-colors"
            >
              ↻ Force Resync Exercise Library
            </button>
          )}
        </div>

        {/* Days List */}
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((schedule) => {
            const template = templates.find(t => t.day === schedule.day)
            const isExpanded = expandedDay === schedule.day;
            const dayExercises = template?.workout_template_exercises?.sort((a: any, b: any) => a.exercise_order - b.exercise_order) || [];
            const isRestDay = dayExercises.length === 0;

            return (
              <div 
                key={schedule.day}
                className={`bg-white dark:bg-[#111111] border rounded-xl overflow-hidden transition-colors ${
                  isExpanded ? 'border-[#FF6B35]/50' : 'border-zinc-200 dark:border-[#1F1F1F] hover:border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {/* Day Row Header */}
                <button
                  onClick={() => toggleDay(schedule.day)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <div>
                    <h2 className="text-lg font-black tracking-wide text-zinc-900 dark:text-white uppercase flex items-center gap-2">
                      {schedule.day}
                      {isRestDay && <span className="text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded ml-2">REST</span>}
                    </h2>
                    <p className="text-sm font-semibold text-[#FF6B35] tracking-wide uppercase mt-1">
                      {schedule.focus}
                    </p>
                  </div>
                  
                  <div className={`p-2 rounded-full bg-white dark:bg-zinc-900 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-[#2A160F] text-[#FF6B35]' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Expanded Exercises List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-zinc-200 dark:border-[#1F1F1F] bg-zinc-50 dark:bg-zinc-950/50"
                    >
                      <div className="p-5 space-y-3">
                        {isRestDay ? (
                          <div className="text-center py-6">
                            <p className="text-zinc-500 font-semibold tracking-wider uppercase text-sm">
                              No exercises assigned. Take a break!
                            </p>
                          </div>
                        ) : (
                          dayExercises.map((te: any, idx: number) => {
                            const ex = te.exercises;
                            return (
                            <div key={te.id} className="flex items-center gap-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-[#1F1F1F] p-3 rounded-lg">
                              <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                                <img src={ex.image_url || '/placeholder.png'} alt={ex.name} className="max-w-full max-h-full object-contain mix-blend-screen" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-200 uppercase tracking-wide text-sm">
                                  {idx + 1}. {ex.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-950 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
                                    Target: {ex.muscle_group}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="block font-black text-zinc-900 dark:text-white">{te.sets} SETS</span>
                                <span className="block font-bold text-zinc-500 text-xs">{te.reps} REPS</span>
                              </div>
                            </div>
                          )})
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
