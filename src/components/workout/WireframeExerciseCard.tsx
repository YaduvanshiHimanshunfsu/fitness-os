'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Exercise } from '@/types/exercise';
import { ArrowRight, Flame, Clock } from 'lucide-react';

export function WireframeExerciseCard({ 
  exercise, 
  currentIndex, 
  totalExercises, 
  completedSets, 
  onSetComplete,
  onFinishExercise,
  onSkipExercise
}: { 
  exercise: Exercise, 
  currentIndex: number, 
  totalExercises: number, 
  completedSets: boolean[], 
  onSetComplete: (idx: number) => void,
  onFinishExercise: () => void,
  onSkipExercise: () => void
}) {
  const setsCount = completedSets.filter(Boolean).length;
  const isMinSetsMet = setsCount >= 2;
  const isAllSetsMet = setsCount >= exercise.sets;

  const progressPercent = Math.round((currentIndex / totalExercises) * 100);
  const caloriesBurned = Math.round((currentIndex + 1) * 15); // Mock metric
  const duration = Math.round((currentIndex + 1) * 4); // Mock metric

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans">
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT PANE: Massive Image Area */}
        <div className="w-full lg:w-1/2 relative bg-zinc-900 overflow-hidden min-h-[40vh] lg:min-h-screen border-r border-zinc-800">
          <AnimatePresence mode="wait">
            <motion.img 
              key={exercise.id}
              src={exercise.imageUrl} 
              alt={exercise.name}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-contain p-4 lg:p-12 opacity-80 mix-blend-luminosity"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIC8+PC9zdmc+';
              }}
            />
          </AnimatePresence>
          
          {/* Overlay Gradient for Text */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
          
          <div className="absolute bottom-12 left-12 right-12 z-10 hidden lg:block">
            <h1 className="text-6xl xl:text-8xl font-black italic tracking-tighter text-white opacity-90 drop-shadow-2xl uppercase">
              {exercise.name}
            </h1>
          </div>
        </div>

        {/* RIGHT PANE: Sequence and Controls */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#0A0A0A] pt-12 pb-40 px-6 lg:px-16 overflow-y-auto">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden mb-8">
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
              {exercise.name}
            </h1>
          </div>

          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-[10px] font-bold text-[#FF4500] uppercase tracking-widest mb-2">
                Exercise {currentIndex + 1} of {totalExercises}
              </div>
              <h2 className="text-3xl font-black tracking-tight uppercase">
                {exercise.sets} Sets × {exercise.reps}
              </h2>
            </div>
            
            <button
              onClick={onSkipExercise}
              className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Sets Sequence List - Compact Pill Format */}
          <div className="flex flex-wrap gap-3 w-full max-w-md">
            {completedSets.map((isCompleted, idx) => (
              <button
                key={idx}
                onClick={() => onSetComplete(idx)}
                disabled={isCompleted}
                className={`flex items-center gap-3 px-5 py-3 rounded-full border transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-[#10B981]/10 border-[#10B981]/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-[#161616] border-zinc-800 hover:border-[#FF4500]/50 cursor-pointer'
                }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center font-bold text-[10px] rounded-full border transition-colors ${
                  isCompleted ? 'bg-[#10B981] border-[#10B981] text-white' : 'border-zinc-600 text-zinc-600'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className={`text-sm font-bold tracking-widest uppercase ${isCompleted ? 'text-white' : 'text-zinc-400'}`}>
                  {exercise.reps} REPS
                </span>
              </button>
            ))}
          </div>
          
          <div className="mt-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Minimum 2 sets required to proceed
            </span>
          </div>

        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-[#111111] border-t border-zinc-800 p-4 lg:p-6 z-50 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-16">
          
          {/* Progress */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Progress</span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-white">{progressPercent}%</span>
              <div className="w-24 lg:w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF4500] rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
          
          {/* Stats (Hidden on small mobile) */}
          <div className="hidden md:flex gap-8 border-l border-zinc-800 pl-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#FF4500]" /> Duration
              </span>
              <span className="text-xl font-black text-white">{duration}:00</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-[#FF4500]" /> Calories
              </span>
              <span className="text-xl font-black text-white">{caloriesBurned}</span>
            </div>
          </div>
          
        </div>

        {/* Next Button */}
        <button
          onClick={onFinishExercise}
          disabled={!isMinSetsMet}
          className={`px-6 lg:px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-all ${
            isMinSetsMet
              ? 'bg-[#FF4500] hover:bg-[#FF5A1F] text-white shadow-[0_0_20px_rgba(255,69,0,0.3)]'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {isAllSetsMet ? 'Next Exercise' : 'Finish Early'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
