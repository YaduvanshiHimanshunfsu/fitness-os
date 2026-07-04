'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Exercise } from '@/types/exercise';
import { ArrowRight, Flame, Clock, Undo2, Play, Pause } from 'lucide-react';
import { StepperInput } from '@/components/ui/StepperInput';
import { useWorkoutStore } from '@/hooks/useWorkout';

export function WireframeExerciseCard({ 
  exercise, 
  currentIndex, 
  totalExercises, 
  completedSets, 
  onSetComplete,
  onFinishExercise,
  onSkipExercise,
  onUndoSet,
}: { 
  exercise: Exercise, 
  currentIndex: number, 
  totalExercises: number, 
  completedSets: boolean[], 
  onSetComplete: (idx: number, reps: number, weight: number, unit: 'kg'|'lbs') => void,
  onFinishExercise: () => void,
  onSkipExercise: () => void,
  onUndoSet?: (exerciseId: number, setIndex: number) => void,
}) {
  const { startTime, completedSets: allCompletedSets } = useWorkoutStore();

  const [currentReps, setCurrentReps] = useState<number[]>(() => {
    const defaultReps = parseInt(typeof exercise.reps === 'string' ? exercise.reps.split('-')[0] : String(exercise.reps || '10')) || 10;
    const existingSets = allCompletedSets.filter(s => s.exerciseId === exercise.id);
    
    return Array(exercise.sets).fill(defaultReps).map((def, idx) => {
      const savedSet = existingSets.find(s => s.setNumber === idx + 1);
      return savedSet ? savedSet.actualReps : def;
    });
  });
  const [isZoomed, setIsZoomed] = useState(false);

  // ─── Live Duration Timer ───────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // ─── Timed Exercise (Countdown) State ──────────────────────────────
  const [activeTimerIdx, setActiveTimerIdx] = useState<number | null>(null);
  const [timerTimeLeft, setTimerTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (activeTimerIdx === null) return;
    if (timerTimeLeft <= 0) {
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate([200, 100, 200]);
      setActiveTimerIdx(null);
      return;
    }
    const id = setInterval(() => setTimerTimeLeft(p => p - 1), 1000);
    return () => clearInterval(id);
  }, [activeTimerIdx, timerTimeLeft]);

  useEffect(() => {
    if (!startTime) return;
    const start = new Date(startTime).getTime();
    const update = () => setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [startTime]);

  const elapsedMin = Math.floor(elapsedSeconds / 60);
  const elapsedSec = elapsedSeconds % 60;

  // ─── Live Calories from actual completed volume ────────────────────
  const liveCalories = React.useMemo(() => {
    let totalVolumeKg = 0;
    for (const s of allCompletedSets) {
      if (s.completed && s.weight_kg) {
        totalVolumeKg += s.weight_kg * s.actualReps;
      }
    }
    // Rough MET-based estimate: ~0.00205 kcal per kg·rep for strength training
    // Also add time-based base burn: ~5 kcal/min for moderate exercise
    return Math.round(totalVolumeKg * 0.00205) + Math.round(elapsedMin * 5);
  }, [allCompletedSets, elapsedMin]);

  const completedCount = completedSets.filter(Boolean).length;
  const progressPercent = Math.round((currentIndex / Math.max(1, totalExercises)) * 100);
  const isMinSetsMet = completedCount >= Math.min(2, exercise.sets);
  const isAllSetsMet = completedCount === exercise.sets;
  
  const isTimed = typeof exercise.reps === 'string' && (exercise.reps.toLowerCase().includes('sec') || exercise.reps.toLowerCase().includes('min'));
  
  const handleSetComplete = (idx: number, reps: number, weight: number, unit: 'kg'|'lbs') => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
    onSetComplete(idx, reps, weight, unit);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A] text-zinc-900 dark:text-white flex flex-col font-sans">
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* LEFT PANE: Massive Image Area */}
        <div className="w-full lg:w-1/2 relative bg-white dark:bg-zinc-900 overflow-hidden min-h-[40vh] lg:min-h-screen border-r border-zinc-200 dark:border-zinc-800">
          <div className="absolute top-4 right-4 z-30">
            <button 
              onClick={() => setIsZoomed(!isZoomed)}
              className="bg-black/50 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 hover:bg-black/70 transition"
            >
              {isZoomed ? 'Zoom Out' : 'Zoom In (Drag)'}
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div 
              key={exercise.id + (isZoomed ? 'z' : 'u')}
              className={`absolute inset-0 w-full h-full ${isZoomed ? 'cursor-grab active:cursor-grabbing z-20' : 'cursor-zoom-in'}`}
              onClick={() => !isZoomed && setIsZoomed(true)}
            >
              <motion.img 
                src={exercise.imageUrl} 
                alt={exercise.name}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag={isZoomed}
                dragConstraints={{ top: -300, left: -300, right: 300, bottom: 300 }}
                className={`w-full h-full object-contain p-4 lg:p-12 opacity-80 mix-blend-luminosity ${isZoomed ? 'mix-blend-normal opacity-100' : ''}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIC8+PC9zdmc+';
                }}
              />
            </motion.div>
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
        <div className="w-full lg:w-1/2 flex flex-col bg-zinc-50 dark:bg-[#0A0A0A] pt-12 pb-40 px-6 lg:px-16 overflow-y-auto">
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden mb-8">
            <h1 className="text-4xl font-black italic tracking-tighter text-zinc-900 dark:text-white uppercase">
              {exercise.name}
            </h1>
          </div>

          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[10px] font-bold text-[#FF4500] uppercase tracking-widest mb-2">
                Exercise {currentIndex + 1} of {totalExercises}
              </div>
              <h2 className="text-3xl font-black tracking-tight uppercase">
                {exercise.sets} Sets Target
              </h2>
            </div>
            
            <button
              onClick={onSkipExercise}
              className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Sets Sequence List */}
          <div className="flex flex-col gap-4 w-full max-w-lg mb-8">
            {completedSets.map((isCompleted, idx) => {
              const active = !isCompleted && (idx === 0 || completedSets[idx - 1]);
              return (
                <div 
                  key={idx}
                  className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-[#10B981]/10 border-[#10B981]/30 opacity-75' 
                      : active 
                        ? 'bg-white/5 border-[#FF4500]/50 shadow-[0_0_20px_rgba(255,69,0,0.1)]' 
                        : 'bg-zinc-100 dark:bg-[#161616] border-zinc-200 dark:border-zinc-800 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Set {idx + 1}</span>
                    <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs rounded-full border transition-colors ${
                      isCompleted ? 'bg-[#10B981] border-[#10B981] text-white' : active ? 'bg-[#FF4500] border-[#FF4500] text-white' : 'border-zinc-600 text-zinc-600'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                  </div>

                  {(!isCompleted && active) ? (
                    <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
                      {isTimed ? (
                        <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-2 flex items-center gap-4">
                          <button
                            onClick={() => {
                              if (activeTimerIdx === idx) {
                                setActiveTimerIdx(null);
                              } else {
                                if (activeTimerIdx === null && timerTimeLeft === 0) {
                                  setTimerTimeLeft(currentReps[idx]);
                                } else if (activeTimerIdx !== idx) {
                                  setTimerTimeLeft(currentReps[idx]);
                                }
                                setActiveTimerIdx(idx);
                              }
                            }}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center text-white transition-colors ${
                              activeTimerIdx === idx ? 'bg-zinc-900 dark:bg-white dark:text-zinc-900' : 'bg-[#FF4500] hover:bg-[#FF5A1F]'
                            }`}
                          >
                            {activeTimerIdx === idx ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </button>
                          <div className="flex-1 flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Seconds Left</span>
                            <span className="text-2xl font-black text-zinc-900 dark:text-white tabular-nums">
                              {activeTimerIdx === idx || (activeTimerIdx === null && timerTimeLeft > 0) ? timerTimeLeft : currentReps[idx]}s
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button 
                              onClick={() => {
                                const n = [...currentReps];
                                n[idx] += 5;
                                setCurrentReps(n);
                                if (activeTimerIdx === idx || (activeTimerIdx === null && timerTimeLeft > 0)) {
                                  setTimerTimeLeft(p => p + 5);
                                }
                              }}
                              className="w-10 h-6 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded flex items-center justify-center text-[10px] font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                            >+5s</button>
                            <button 
                              onClick={() => {
                                const n = [...currentReps];
                                n[idx] = Math.max(0, n[idx] - 5);
                                setCurrentReps(n);
                                if (activeTimerIdx === idx || (activeTimerIdx === null && timerTimeLeft > 0)) {
                                  setTimerTimeLeft(p => Math.max(0, p - 5));
                                }
                              }}
                              className="w-10 h-6 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded flex items-center justify-center text-[10px] font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                            >-5s</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <StepperInput 
                            label="Reps" 
                            value={currentReps[idx]} 
                            onChange={(val) => {
                              const n = [...currentReps];
                              n[idx] = val;
                              setCurrentReps(n);
                            }} 
                            min={0} max={100} step={1} 
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSetComplete(idx, currentReps[idx], 0, 'kg')}
                        className="h-[60px] mt-auto sm:w-16 flex items-center justify-center bg-[#FF4500] hover:bg-[#FF5A1F] text-white rounded-xl shadow-[0_0_15px_rgba(255,69,0,0.4)] transition-all active:scale-95"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-between pl-4">
                      {isCompleted ? (
                        <div className="flex items-center gap-4">
                          <span className="text-zinc-900 dark:text-white font-bold">{currentReps[idx]} <span className="text-[10px] text-zinc-500 uppercase">{isTimed ? 'Seconds' : 'Reps'}</span></span>
                          {/* Undo Button */}
                          {onUndoSet && idx === completedSets.lastIndexOf(true) && (
                            <button
                              onClick={() => onUndoSet(exercise.id, idx)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-[#FF4500] hover:border-[#FF4500]/50 transition-colors text-[10px] font-bold uppercase tracking-widest"
                            >
                              <Undo2 className="w-3 h-3" /> Redo
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Waiting...</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-200 dark:border-white/10">
            <div className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Minimum 2 sets required to proceed
            </span>
          </div>

        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#111111] border-t border-zinc-200 dark:border-zinc-800 p-4 lg:p-6 z-50 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-16">
          
          {/* Progress */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Progress</span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-zinc-900 dark:text-white">{progressPercent}%</span>
              <div className="w-24 lg:w-48 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF4500] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
          
          {/* Live Stats */}
          <div className="hidden md:flex gap-8 border-l border-zinc-200 dark:border-zinc-800 pl-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#FF4500]" /> Duration
              </span>
              <span className="text-xl font-black text-zinc-900 dark:text-white tabular-nums">
                {String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-[#FF4500]" /> Calories
              </span>
              <span className="text-xl font-black text-zinc-900 dark:text-white tabular-nums">{liveCalories}</span>
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
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {isAllSetsMet ? 'Next Exercise' : 'Finish Early'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
