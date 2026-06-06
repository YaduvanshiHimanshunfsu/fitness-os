'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Activity, CheckSquare, Square, X, Pause } from 'lucide-react';
import { WARMUP_IMAGE } from '@/constants/warmup';

export function WireframeWarmup({ nextRoute }: { exercises?: any[]; nextRoute: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<'warmup' | 'rest'>('warmup');
  const [timeLeft, setTimeLeft] = useState(30); // 30s warmup
  const [restTimeLeft, setRestTimeLeft] = useState(20); // 20s rest transition

  const totalWarmupTime = 30;
  const totalRestTime = 20;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'warmup') {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (phase === 'rest') {
      timer = setInterval(() => {
        setRestTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'warmup' && timeLeft === 0) {
      setPhase('rest');
    }
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === 'rest' && restTimeLeft === 0) {
      router.push(nextRoute);
    }
  }, [phase, restTimeLeft, nextRoute, router]);

  const handleSkipWarmupTimer = () => {
    setTimeLeft(0);
  };

  const handleSkipRestTimer = () => {
    setRestTimeLeft(0);
  };

  const warmupPercent = (timeLeft / totalWarmupTime) * 100;
  const restPercent = (restTimeLeft / totalRestTime) * 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center p-4 md:p-8 font-sans">
      
      {/* Top Bar inside the screen like a modal */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-4 px-2">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors" onClick={() => router.push('/dashboard')}>
          <X className="w-5 h-5 text-zinc-500" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {phase === 'warmup' ? 'WARMUP ROUTINE' : 'TRANSITION REST'}
          </span>
          <div className="flex gap-1.5 mt-2">
            <div className={`h-1 rounded-full transition-all ${phase === 'warmup' ? 'w-6 bg-[#FF4500]' : 'w-4 bg-zinc-300'}`} />
            <div className={`h-1 rounded-full transition-all ${phase === 'rest' ? 'w-6 bg-[#FF4500]' : 'w-4 bg-zinc-300'}`} />
            <div className="w-4 h-1 rounded-full bg-zinc-300" />
            <div className="w-4 h-1 rounded-full bg-zinc-300" />
          </div>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors">
          <Pause className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'warmup' ? (
          <motion.div
            key="warmup-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full max-w-5xl bg-white rounded-[2rem] shadow-sm overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left side: Huge Image */}
            <div className="w-full md:w-1/2 relative bg-zinc-100 flex items-center justify-center p-4">
              <img 
                src={WARMUP_IMAGE} 
                alt="Jumping Jacks" 
                className="w-full h-full object-cover max-h-[60vh] rounded-3xl opacity-80"
                style={{ filter: 'grayscale(100%)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent mix-blend-overlay pointer-events-none" />
              
              {/* Target Zone Pill */}
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

            {/* Right side: Controls */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center bg-white relative">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Full Body Warmup</h1>
                <p className="text-sm font-bold text-[#FF4500] mt-2">Warmup • Set 1</p>
              </div>

              {/* Timer Circle */}
              <div className="relative w-56 h-56 flex items-center justify-center mb-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" className="stroke-zinc-100 fill-none" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="46"
                    className="stroke-[#C23300] fill-none"
                    strokeWidth="6"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * warmupPercent) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute flex items-baseline">
                  <span className="text-6xl font-black text-zinc-900 tracking-tighter">{timeLeft}</span>
                  <span className="text-2xl font-black text-[#C23300] ml-1">S</span>
                </div>
              </div>

              <div className="w-full max-w-sm flex items-center justify-between mb-4 px-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Next Up</span>
                <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">Active Stretching</span>
              </div>

              {/* Mark Complete Button */}
              <button
                onClick={handleSkipWarmupTimer}
                className="w-full max-w-sm py-5 px-6 bg-[#F9FAFB] hover:bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center gap-4 transition-colors group cursor-pointer"
              >
                <Square className="w-6 h-6 text-zinc-300 group-hover:text-zinc-400" />
                <span className="text-lg font-bold text-zinc-900">Mark Complete</span>
              </button>
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
            {/* Same layout for rest but simpler */}
            <div className="w-full md:w-1/2 bg-[#FFF0EB] flex flex-col items-center justify-center p-12 text-center">
              <h2 className="text-4xl font-black text-[#FF4500] mb-4">REST</h2>
              <p className="text-zinc-700 font-medium max-w-xs">Take deep breaths and prepare for your first real set.</p>
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center bg-white relative">
              <div className="relative w-56 h-56 flex items-center justify-center mb-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" className="stroke-zinc-100 fill-none" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="46"
                    className="stroke-[#F59E0B] fill-none"
                    strokeWidth="6"
                    strokeDasharray="289"
                    strokeDashoffset={289 - (289 * restPercent) / 100}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-6xl font-black text-zinc-900 tracking-tighter">{restTimeLeft}</span>
                </div>
              </div>

              <button
                onClick={handleSkipRestTimer}
                className="w-full max-w-sm py-5 px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-bold uppercase tracking-widest text-sm flex items-center justify-center transition-colors cursor-pointer"
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
