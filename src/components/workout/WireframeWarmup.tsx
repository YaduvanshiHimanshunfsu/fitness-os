'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Activity, X, Pause, Play, Plus } from 'lucide-react';
import { WARMUP_IMAGE, WARMUP_EXERCISES } from '@/constants/warmup';

export function WireframeWarmup({ exercises, image, nextRoute }: { exercises?: any[]; image?: string; nextRoute: string }) {
  const router = useRouter();

  const activeExercises = exercises && exercises.length > 0 ? exercises : WARMUP_EXERCISES;
  const activeImage = image || WARMUP_IMAGE;

  // Phase state
  const [phase,        setPhase]        = useState<'warmup' | 'rest'>('warmup');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft,     setTimeLeft]     = useState(activeExercises[0].durationSeconds || activeExercises[0].duration_seconds);
  const [totalTime,    setTotalTime]    = useState(activeExercises[0].durationSeconds || activeExercises[0].duration_seconds);
  const [restTimeLeft, setRestTimeLeft] = useState(20);
  const [isPaused,     setIsPaused]     = useState(false);

  const totalRestTime   = 20;
  const currentExercise = activeExercises[currentIndex];

  // When current exercise changes, reset the timer
  useEffect(() => {
    if (phase === 'warmup') {
      const dur = activeExercises[currentIndex].durationSeconds || activeExercises[currentIndex].duration_seconds;
      setTimeLeft(dur);
      setTotalTime(dur);
    }
  }, [currentIndex, phase, activeExercises]);

  // Warmup countdown — respects isPaused
  useEffect(() => {
    if (phase !== 'warmup') return;
    if (isPaused) return;           // ← pause gate
    if (timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, isPaused, timeLeft]);

  // Rest countdown — respects isPaused
  useEffect(() => {
    if (phase !== 'rest') return;
    if (isPaused) return;
    if (restTimeLeft <= 0) return;

    const id = setInterval(() => {
      setRestTimeLeft(prev => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, isPaused, restTimeLeft]);

  // Transition warmup → next exercise OR rest
  useEffect(() => {
    if (phase === 'warmup' && timeLeft === 0) {
      if (currentIndex < activeExercises.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsPaused(false);     // always resume for rest phase
        setPhase('rest');
      }
    }
  }, [phase, timeLeft, currentIndex]);

  // Navigate when rest ends
  useEffect(() => {
    if (phase === 'rest' && restTimeLeft === 0) {
      router.push(nextRoute);
    }
  }, [phase, restTimeLeft, nextRoute, router]);

  const warmupPercent = (timeLeft / totalTime) * 100;
  const restPercent   = (restTimeLeft / totalRestTime) * 100;

  const handleAdd10Sec = () => {
    setTimeLeft(prev => prev + 10);
    setTotalTime(prev => prev + 10);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center p-4 md:p-8 font-sans">

      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4 px-2">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors"
          onClick={() => router.push('/dashboard')}
          title="Exit"
        >
          <X className="w-5 h-5 text-zinc-500" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
            {phase === 'warmup' ? 'WARMUP ROUTINE' : 'TRANSITION REST'}
          </span>
          <div className="flex gap-1.5 mt-2">
            {activeExercises.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all ${phase === 'warmup' && currentIndex >= idx ? 'w-6 bg-[#FF4500]' : phase === 'rest' ? 'w-6 bg-[#FF4500]' : 'w-4 bg-zinc-300'}`} 
              />
            ))}
            <div className={`h-1 rounded-full transition-all ${phase === 'rest'   ? 'w-6 bg-[#FF4500]' : 'w-4 bg-zinc-300'}`} />
          </div>
        </div>

        {/* ✅ Pause / Resume button — now fully wired */}
        <button
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            isPaused
              ? 'bg-[#FF4500] text-zinc-900 dark:text-white hover:bg-[#E03C00]'
              : 'hover:bg-zinc-200 text-zinc-500'
          }`}
          onClick={() => setIsPaused(p => !p)}
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused
            ? <Play  className="w-5 h-5" fill="currentColor" />
            : <Pause className="w-5 h-5" />
          }
        </button>
      </div>

      {/* Pause Overlay Banner */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-5xl mb-3 px-2"
          >
            <div className="bg-[#FF4500] text-zinc-900 dark:text-white text-center text-sm font-black uppercase tracking-widest py-2.5 rounded-xl">
              ⏸ Paused — tap the button above to resume
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === 'warmup' ? (
          <motion.div
            key="warmup-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full max-w-5xl bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col md:flex-row"
          >
            {/* Image */}
            <div className="w-full md:w-1/2 relative bg-zinc-100 flex items-center justify-center p-4">
              <img
                src={activeImage}
                alt="Full Body Warm-Up Routine"
                className="w-full h-full object-cover max-h-[60vh] rounded-3xl opacity-80"
                style={{ filter: 'grayscale(100%)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent mix-blend-overlay pointer-events-none" />
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-red-50 text-[#FF4500] flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Target Zone</div>
                  <div className="text-lg font-black text-zinc-900 mt-0.5">110-130 BPM</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center bg-white">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-zinc-900 tracking-tight">{currentExercise.name}</h1>
                <p className="text-sm font-bold text-[#FF4500] mt-2">Warmup • Set {currentIndex + 1} of {activeExercises.length}</p>
              </div>

              {/* Timer Circle */}
              <div className="relative w-56 h-56 flex items-center justify-center mb-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" className="stroke-zinc-100 fill-none" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="46"
                    className={`fill-none ${isPaused ? 'stroke-zinc-300' : 'stroke-[#C23300]'}`}
                    strokeWidth="6"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * warmupPercent) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                  />
                </svg>
                <div className="absolute flex items-baseline">
                  <span className="text-6xl font-black text-zinc-900 tracking-tighter">{timeLeft}</span>
                  <span className="text-2xl font-black text-[#C23300] ml-1">s</span>
                </div>
              </div>

              <div className="w-full max-w-sm flex items-center justify-between mb-4 px-2">
                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Next Up</span>
                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">
                  {currentIndex < WARMUP_EXERCISES.length - 1 ? WARMUP_EXERCISES[currentIndex + 1].name : 'Rest Transition'}
                </span>
              </div>

              <div className="w-full max-w-sm flex gap-4">
                <button
                  onClick={() => setTimeLeft(0)}
                  className="flex-1 py-5 px-6 bg-[#F9FAFB] hover:bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  <span className="text-lg font-bold text-zinc-900">Mark Complete</span>
                </button>
                <button
                  onClick={handleAdd10Sec}
                  className="w-16 flex items-center justify-center bg-[#F9FAFB] hover:bg-zinc-100 border border-zinc-200 rounded-2xl transition-colors cursor-pointer"
                  title="Add 10 seconds"
                >
                  <Plus className="w-6 h-6 text-zinc-900" />
                </button>
              </div>
            </div>
          </motion.div>

        ) : (
          <motion.div
            key="rest-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full max-w-5xl bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col md:flex-row border border-zinc-200"
          >
            <div className="w-full md:w-1/2 bg-[#FFF0EB] flex flex-col items-center justify-center p-12 text-center">
              <h2 className="text-4xl font-black text-[#FF4500] mb-4">REST</h2>
              <p className="text-zinc-700 font-medium max-w-xs">
                Take deep breaths and prepare for your first real set.
              </p>
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center bg-white">
              <div className="relative w-56 h-56 flex items-center justify-center mb-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" className="stroke-zinc-100 fill-none" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="46"
                    className={`fill-none ${isPaused ? 'stroke-zinc-300' : 'stroke-[#F59E0B]'}`}
                    strokeWidth="6"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * restPercent) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-6xl font-black text-zinc-900 tracking-tighter">{restTimeLeft}</span>
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest mt-1">seconds</span>
                </div>
              </div>

              <button
                onClick={() => setRestTimeLeft(0)}
                className="w-full max-w-sm py-5 px-6 bg-white dark:bg-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center transition-colors cursor-pointer"
              >
                Skip Rest
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
