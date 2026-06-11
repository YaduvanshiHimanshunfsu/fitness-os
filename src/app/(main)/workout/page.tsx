'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Reorder } from 'framer-motion';
import { EXERCISES } from '@/constants/exercises';
import { useWorkoutStore } from '@/hooks/useWorkout';
import { Dumbbell, GripVertical, Play } from 'lucide-react';

export default function WorkoutTemplatePage() {
  const router = useRouter();
  const todayExercises = useWorkoutStore(state => state.todayExercises);
  const setExercises = useWorkoutStore(state => state.setExercises);

  const [items, setItems] = useState<typeof EXERCISES>([]);

  useEffect(() => {
    // Load from the active session store
    if (todayExercises && todayExercises.length > 0) {
      setItems(todayExercises);
    } else {
      // Fallback just in case
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = dayNames[new Date().getDay()];
      setItems(EXERCISES.filter(ex => ex.day === today).sort((a, b) => a.exerciseOrder - b.exerciseOrder));
    }
  }, [todayExercises]);

  const handleStart = () => {
    setExercises(items);
    router.push('/workout/warmup');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0A0A0A] p-4 md:p-8 font-sans pb-32">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Today's Template</h1>
        <p className="text-zinc-600 dark:text-zinc-400 font-medium mb-8">Drag and drop to reorder your exercises before starting.</p>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Rest Day! No exercises scheduled.</p>
          </div>
        ) : (
          <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
            {items.map((ex) => (
              <Reorder.Item 
                key={ex.id} 
                value={ex}
                className="flex items-center gap-4 bg-[#111] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-zinc-300 dark:border-zinc-700 transition-colors"
              >
                <div className="text-zinc-600">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-950 rounded-lg flex items-center justify-center p-2 shrink-0 border border-zinc-200 dark:border-zinc-800">
                  <img src={ex.imageUrl} alt={ex.name} className="max-w-full max-h-full object-contain mix-blend-screen" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wide text-sm">{ex.name}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                    {ex.sets} Sets • {ex.reps}
                  </p>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}

        {items.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-[#FF4500] to-[#E03C00] text-zinc-900 dark:text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,69,0,0.2)]"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Workout
          </motion.button>
        )}
      </div>
    </div>
  );
}
