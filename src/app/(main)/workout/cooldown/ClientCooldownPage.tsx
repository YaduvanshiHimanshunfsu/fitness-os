'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clock, Play, SkipForward, ArrowRight } from 'lucide-react';
import { COOLDOWN_EXERCISES, COOLDOWN_IMAGE } from '@/constants/cooldown';
import { useWorkoutStore } from '@/hooks/useWorkout';
import confetti from 'canvas-confetti';

export default function ClientCooldownPage({ exercises, image }: { exercises?: any[]; image?: string }) {
  const router = useRouter();
  const { setPhase } = useWorkoutStore();
  
  const activeExercises = exercises && exercises.length > 0 ? exercises : COOLDOWN_EXERCISES;
  const activeImage = image || COOLDOWN_IMAGE;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setLocalPhase] = useState<'exercise' | 'rest'>('exercise');
  const [timeLeft, setTimeLeft] = useState(activeExercises[0]?.durationSeconds || activeExercises[0]?.duration_seconds || 30);
  const [restTimeLeft, setRestTimeLeft] = useState(15);

  const currentExercise = activeExercises[currentIndex];
  const totalStretchTime = currentExercise?.durationSeconds || currentExercise?.duration_seconds || 30;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'exercise') {
      if (timeLeft <= 0) return;
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCompleteStretch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (phase === 'rest') {
      if (restTimeLeft <= 0) {
        handleNext();
        return;
      }
      timer = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phase, timeLeft, restTimeLeft]);

  const handleNext = () => {
    if (currentIndex < activeExercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(activeExercises[currentIndex + 1].durationSeconds || activeExercises[currentIndex + 1].duration_seconds);
      setRestTimeLeft(15);
      setLocalPhase('exercise');
    } else {
      setPhase('summary');
      router.push('/workout/summary');
    }
  };

  const handleCompleteStretch = () => {
    // Confetti pop on stretch completed
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#FF6B35', '#10B981']
    });

    if (currentIndex < activeExercises.length - 1) {
      setLocalPhase('rest');
    } else {
      setPhase('summary');
      router.push('/workout/summary');
    }
  };

  const handleSkipRest = () => {
    setRestTimeLeft(0);
    handleNext();
  };

  if (!currentExercise) return null;

  const stretchPercent = (timeLeft / totalStretchTime) * 100;
  const restPercent = (restTimeLeft / 15) * 100;

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-6">
      <AnimatePresence mode="wait">
        {phase === 'exercise' ? (
          <motion.div
            key={`stretch-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-xl bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#1F1F1F] rounded-2xl p-6 md:p-8 flex flex-col items-center shadow-2xl relative"
          >
            {/* Header info */}
            <div className="flex flex-col items-center text-center mb-6">
              <span className="text-[10px] font-mono font-black tracking-widest text-[#FF6B35] bg-[#2A160F] border border-[#FF6B35]/15 px-2.5 py-1 rounded-md uppercase">
                Phase 5: Cool Down
              </span>
              <h2 className="text-2xl md:text-3xl font-sans font-black tracking-tight text-zinc-900 dark:text-white mt-3 uppercase">
                {currentExercise.name}
              </h2>
              <span className="text-[10px] font-mono font-black tracking-widest text-zinc-500 uppercase mt-1">
                Stretch {currentIndex + 1} of {activeExercises.length}
              </span>
            </div>

            {/* Cool Down Image */}
            <div className="w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-[#1F1F1F] bg-zinc-50 dark:bg-zinc-950 p-2 mb-6 flex justify-center shadow-lg">
              <img 
                src={activeImage} 
                alt="Cool Down stretch demonstration" 
                className="max-h-[260px] w-auto object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMTExMTEiIC8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNTU1IiBkeT0iLjNlbSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>

            {/* SVG Countdown Timer */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-zinc-900 fill-none"
                  strokeWidth="5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-[#FF6B35] fill-none"
                  strokeWidth="5"
                  strokeDasharray="276.4"
                  strokeDashoffset={276.4 - (276.4 * stretchPercent) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-mono text-3xl font-black text-zinc-900 dark:text-white tabular-nums">
                  {timeLeft}
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                  Sec Left
                </span>
              </div>
            </div>

            {/* Manual Skip or Progress button */}
            <button
              onClick={handleCompleteStretch}
              className="w-full py-4 rounded-xl font-sans font-black tracking-widest text-xs uppercase bg-[#FF6B35] hover:bg-[#FF8C61] border-[#FF6B35] text-zinc-900 dark:text-white shadow-[0_0_20px_rgba(255,107,53,0.25)] hover:shadow-[0_0_30px_rgba(255,107,53,0.45)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Skip / Next Stretch <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="rest-cooldown"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md bg-white dark:bg-[#111111] border border-zinc-200 dark:border-[#1F1F1F] rounded-2xl p-6 md:p-8 flex flex-col items-center shadow-2xl"
          >
            <span className="text-[10px] font-mono font-black tracking-widest text-[#FF6B35] bg-[#2A160F] border border-[#FF6B35]/15 px-2.5 py-1 rounded-md uppercase">
              15s Stretch Rest
            </span>
            <h2 className="text-xl md:text-2xl font-sans font-black tracking-tight text-zinc-900 dark:text-white mt-4 uppercase">
              Prepare Next Stretch
            </h2>
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">
              Keep body moving slowly
            </p>

            {/* Circular Rest SVG Timer */}
            <div className="relative w-32 h-32 flex items-center justify-center my-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-zinc-900 fill-none"
                  strokeWidth="5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-[#FF6B35] fill-none"
                  strokeWidth="5"
                  strokeDasharray="276.4"
                  strokeDashoffset={276.4 - (276.4 * restPercent) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-black text-zinc-900 dark:text-white tabular-nums">
                  {restTimeLeft}
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-0.5">
                  Rest Sec
                </span>
              </div>
            </div>

            <div className="w-full bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-center mb-6">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-mono">
                Up Next
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase block mt-1">
                {activeExercises[currentIndex + 1]?.name || 'Summary'}
              </span>
            </div>

            <button
              onClick={handleSkipRest}
              className="w-full py-4 border border-zinc-200 dark:border-[#1F1F1F] hover:border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 hover:bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <SkipForward className="w-4 h-4" /> Skip Rest
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
