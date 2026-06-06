'use client';

import React, { useState } from 'react';
import { EXERCISES } from '@/constants/exercises';
import { ChevronDown, Calendar, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS_OF_WEEK = [
  { day: 'monday', focus: 'Chest, Arms, Forearms' },
  { day: 'tuesday', focus: 'Back & Shoulders' },
  { day: 'wednesday', focus: 'Abs & Core' },
  { day: 'thursday', focus: 'Rest Day / Active Recovery' },
  { day: 'friday', focus: 'Legs & Knee Stability' },
  { day: 'saturday', focus: 'Chest & Arms Variation' },
  { day: 'sunday', focus: 'Full Body & Athletic' },
];

export default function SchedulePage() {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

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
          <h1 className="text-3xl md:text-4xl font-sans font-black tracking-tight text-white uppercase">
            All Exercises
          </h1>
          <p className="text-zinc-400 mt-2 font-medium">
            Review your full weekly workout schedule and muscle focus days.
          </p>
        </div>

        {/* Days List */}
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((schedule) => {
            const isExpanded = expandedDay === schedule.day;
            const dayExercises = EXERCISES.filter(ex => ex.day === schedule.day).sort((a, b) => a.exerciseOrder - b.exerciseOrder);
            const isRestDay = dayExercises.length === 0;

            return (
              <div 
                key={schedule.day}
                className={`bg-[#111111] border rounded-xl overflow-hidden transition-colors ${
                  isExpanded ? 'border-[#FF6B35]/50' : 'border-[#1F1F1F] hover:border-zinc-800'
                }`}
              >
                {/* Day Row Header */}
                <button
                  onClick={() => toggleDay(schedule.day)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <div>
                    <h2 className="text-lg font-black tracking-wide text-white uppercase flex items-center gap-2">
                      {schedule.day}
                      {isRestDay && <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded ml-2">REST</span>}
                    </h2>
                    <p className="text-sm font-semibold text-[#FF6B35] tracking-wide uppercase mt-1">
                      {schedule.focus}
                    </p>
                  </div>
                  
                  <div className={`p-2 rounded-full bg-zinc-900 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-[#2A160F] text-[#FF6B35]' : 'text-zinc-400'}`}>
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
                      className="border-t border-[#1F1F1F] bg-zinc-950/50"
                    >
                      <div className="p-5 space-y-3">
                        {isRestDay ? (
                          <div className="text-center py-6">
                            <p className="text-zinc-500 font-semibold tracking-wider uppercase text-sm">
                              No exercises assigned. Take a break!
                            </p>
                          </div>
                        ) : (
                          dayExercises.map((ex, idx) => (
                            <div key={ex.id} className="flex items-center gap-4 bg-zinc-900/50 border border-[#1F1F1F] p-3 rounded-lg">
                              <div className="w-12 h-12 bg-zinc-950 rounded-md border border-zinc-800 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                                <img src={ex.imageUrl} alt={ex.name} className="max-w-full max-h-full object-contain mix-blend-screen" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-zinc-200 uppercase tracking-wide text-sm">
                                  {idx + 1}. {ex.name}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                                    Target: {ex.muscleGroup}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="block font-black text-white">{ex.sets} SETS</span>
                                <span className="block font-bold text-zinc-500 text-xs">{ex.reps} REPS</span>
                              </div>
                            </div>
                          ))
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
