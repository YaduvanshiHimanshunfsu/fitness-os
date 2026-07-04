'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Timer, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

// High-performance TiltCard with GPU acceleration and Parallax Glare
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Moderate tilt angles for less nausea but still premium feel
  const rotateX = useTransform(y, [-300, 300], [4, -4]);
  const rotateY = useTransform(x, [-300, 300], [-4, 4]);

  // Dynamic Parallax Glare positioning
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    // For tilt
    x.set(currentX - rect.width / 2);
    y.set(currentY - rect.height / 2);

    // For glare
    mouseX.set(currentX);
    mouseY.set(currentY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ 
        x: 0, y: 0, 
        rotateX, rotateY, 
        perspective: 1500,
        transformStyle: "preserve-3d",
        // Force Hardware Acceleration
        translateZ: 0,
        willChange: "transform"
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${className} relative group`}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Dynamic Parallax Glare Overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([mx, my]) => `radial-gradient(circle 600px at ${mx}px ${my}px, rgba(255,255,255,0.06), transparent 40%)`
          )
        }}
      />
      {children}
    </motion.div>
  );
}

export function WireframeRoutine({ 
  title, 
  exercises, 
  imageUrl,
  nextRoute 
}: { 
  title: string;
  exercises: any[]; 
  imageUrl: string;
  nextRoute: string;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({});
  const [phase, setPhase] = useState<'exercise' | 'rest'>('exercise');
  const [restTimeLeft, setRestTimeLeft] = useState(0);

  const currentExercise = exercises[currentIndex];
  const currentCompleted = completedSets[currentIndex] || Array(currentExercise?.sets || 2).fill(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'rest' && restTimeLeft > 0) {
      timer = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            if (currentIndex < exercises.length - 1) {
              setCurrentIndex((idx) => idx + 1);
              setPhase('exercise');
            } else {
              router.push(nextRoute);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phase, restTimeLeft, currentIndex, exercises.length, nextRoute, router]);

  const handleSetComplete = (setIndex: number) => {
    if (currentCompleted[setIndex]) return;

    const newCompleted = [...currentCompleted];
    newCompleted[setIndex] = true;
    
    setCompletedSets((prev) => ({
      ...prev,
      [currentIndex]: newCompleted
    }));

    const isAllSetsComplete = newCompleted.every(Boolean);
    if (isAllSetsComplete) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF6B35', '#FF8C61', '#10B981']
      });

      setRestTimeLeft(15);
      setPhase('rest');
    }
  };

  const handleSkipRest = () => {
    setRestTimeLeft(0);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setPhase('exercise');
    } else {
      router.push(nextRoute);
    }
  };

  if (!currentExercise) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // Use grid/flex appropriately to prevent pushing layout below fold
      className="min-h-[calc(100vh-6rem)] bg-zinc-50 dark:bg-[#0A0A0A] flex flex-col items-center justify-center py-6 px-4 font-sans text-zinc-900 dark:text-white relative overflow-hidden"
    >
      {/* Background Ambient Glows */}
      <div className="fixed top-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#10B981]/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#FF4500]/20 blur-[150px] pointer-events-none" />

      {/* Top Breadcrumb/Nav */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8 relative z-10">
        <div className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          {title} <span className="text-[#FF4500] mx-2">•</span> {currentIndex + 1}/{exercises.length}
        </div>
        <button onClick={() => router.push(nextRoute)} className="text-[10px] font-bold text-zinc-500 uppercase hover:text-zinc-900 dark:text-white transition-colors tracking-widest">
          Skip Routine
        </button>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'exercise' ? (
          <TiltCard
            key={`exercise-${currentIndex}`}
            className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10 relative z-10"
          >
            {/* LEFT: Phone Frame Image - Fixed to Object Contain */}
            <div className="w-full md:w-1/2 bg-white dark:bg-[#0A0A0A]/50 flex items-center justify-center border-r border-white/10 relative overflow-hidden p-4">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF4500]/5 to-transparent pointer-events-none z-0" />

              <motion.img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-auto max-h-[75vh] object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIC8+PC9zdmc+';
                }}
              />
            </div>

            {/* RIGHT: Content & Controls */}
            <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-tight">
                  {currentExercise.name}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium text-sm mt-2 max-w-md">
                  Focus on form and slow, controlled movements. Quality over quantity.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10 shadow-inner"
              >
                <div className="text-[10px] font-bold text-[#FF4500] uppercase tracking-widest mb-1">Current Set Goal</div>
                <div className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {currentExercise.sets} SETS <span className="text-[#FF4500] mx-2">•</span> {currentExercise.reps || '15'} REPS
                </div>
              </motion.div>

              {/* Set Checkboxes - Compact & Scrollable */}
              <div className="flex flex-col gap-2 mb-8 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {currentCompleted.map((isCompleted, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.05) }}
                    onClick={() => handleSetComplete(idx)}
                    disabled={isCompleted}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer shrink-0 ${
                      isCompleted 
                        ? 'bg-white/5 border-white/5 text-zinc-600' 
                        : 'bg-white/10 border-white/20 hover:border-[#FF4500] hover:bg-white/20'
                    }`}
                  >
                    <span className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-white">Set {idx + 1}</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isCompleted ? 'bg-[#10B981] text-zinc-900 dark:text-white' : 'bg-black/50 text-zinc-500 border border-white/20'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-sm bg-zinc-600" />}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-auto pt-4 border-t border-white/10">
                <Timer className="w-4 h-4" /> Rest Interval: 00:15 sec
              </div>
            </div>
          </TiltCard>
        ) : (
          <TiltCard
            key="rest-routine"
            className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-12 flex flex-col items-center border border-white/10 text-center relative z-10"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-[#FF4500]/20 border border-[#FF4500]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,69,0,0.3)]"
            >
              <Timer className="w-10 h-10 text-[#FF4500]" />
            </motion.div>
            
            <h2 className="text-3xl font-black uppercase text-zinc-900 dark:text-white tracking-tight">Active Rest</h2>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium mt-2 mb-10 max-w-sm">
              Take a moment to reset your posture before the next exercise.
            </p>

            <motion.div 
              key={restTimeLeft}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[120px] font-black text-zinc-900 dark:text-white tracking-tighter leading-none mb-10 drop-shadow-2xl"
            >
              {restTimeLeft}
            </motion.div>

            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Up Next</div>
              <div className="bg-white/10 backdrop-blur-md w-full p-4 rounded-xl border border-white/20 font-bold text-zinc-900 dark:text-white">
                {exercises[currentIndex + 1]?.name || 'Routine Finished'}
              </div>
              
              <button
                onClick={handleSkipRest}
                className="w-full mt-4 py-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Skip Rest <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </TiltCard>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
