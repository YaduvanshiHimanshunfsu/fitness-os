'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SkipForward, Pause, Play } from 'lucide-react';
import { useWorkoutStore } from '@/hooks/useWorkout';

export function WireframeRestScreen({
  timeLeft,
  nextExerciseName,
  onSkip,
  onResume,
}: {
  timeLeft: number;
  nextExerciseName: string;
  onSkip: () => void;
  onResume: () => void;
}) {
  const { isPaused, pauseRestTimer, resumeRestTimer, addRestTime } = useWorkoutStore();

  // Determine if it's set rest (15s) or exercise rest (30s)
  const totalRest = timeLeft > 15 ? 30 : 15;
  const percent = isPaused
    ? (timeLeft / totalRest) * 100
    : (timeLeft / totalRest) * 100;

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="w-full max-w-md bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#1F1F1F] rounded-2xl p-6 md:p-8 flex flex-col items-center shadow-2xl"
      >
        <span className="text-[10px] font-mono font-black tracking-widest text-[#FF6B35] bg-[#2A160F] border border-[#FF6B35]/15 px-2.5 py-1 rounded-md uppercase">
          {isPaused ? 'Paused' : 'Rest Phase'}
        </span>
        <h2 className="text-xl md:text-2xl font-sans font-black tracking-tight text-zinc-900 dark:text-white mt-4 uppercase">
          {isPaused ? 'Timer Paused' : 'Catch Your Breath'}
        </h2>
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">
          {isPaused ? 'Take your time' : 'Stay hydrated, breathe deep'}
        </p>

        {/* Circular SVG Timer with Modifiers */}
        <div className="flex items-center justify-center gap-4 my-8">
          <button 
            onClick={() => addRestTime(-15)}
            className="w-10 h-10 rounded-full border border-zinc-200 dark:border-[#1F1F1F] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors text-xs font-bold"
          >
            -15
          </button>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-zinc-200 dark:stroke-zinc-900 fill-none"
                strokeWidth="5"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`fill-none ${isPaused ? 'stroke-amber-500' : 'stroke-[#FF6B35]'}`}
                strokeWidth="5"
                strokeDasharray="276.4"
                strokeDashoffset={276.4 - (276.4 * percent) / 100}
                strokeLinecap="round"
                style={{ transition: isPaused ? 'none' : 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`font-mono text-4xl font-black tabular-nums ${isPaused ? 'text-amber-500 animate-pulse' : 'text-zinc-900 dark:text-white'}`}>
                {timeLeft}
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-0.5">
                {isPaused ? 'Paused' : 'Rest Sec'}
              </span>
            </div>
          </div>

          <button 
            onClick={() => addRestTime(15)}
            className="w-10 h-10 rounded-full border border-zinc-200 dark:border-[#1F1F1F] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors text-xs font-bold"
          >
            +15
          </button>
        </div>

        {/* Pause/Resume Button */}
        <button
          onClick={isPaused ? resumeRestTimer : pauseRestTimer}
          className={`w-full py-4 mb-3 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
            isPaused
              ? 'bg-[#FF6B35] text-white hover:bg-[#FF8C61]'
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
          }`}
        >
          {isPaused ? <><Play className="w-4 h-4" /> Resume Timer</> : <><Pause className="w-4 h-4" /> Pause Timer</>}
        </button>

        {/* Next Exercise Panel */}
        <div className="w-full bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-900 text-center mb-4">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
            Up Next
          </span>
          <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight block mt-1 leading-snug">
            {nextExerciseName}
          </span>
        </div>

        {/* Skip button */}
        <button
          onClick={onSkip}
          className="w-full py-4 border border-zinc-200 dark:border-[#1F1F1F] hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <SkipForward className="w-4 h-4" /> Skip Rest
        </button>

        <button
          onClick={onResume}
          className="mt-3 w-full py-4 border border-[#FF6B35]/30 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/15 text-[#FF6B35] font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          Resume Exercise
        </button>
      </motion.div>
    </div>
  );
}
