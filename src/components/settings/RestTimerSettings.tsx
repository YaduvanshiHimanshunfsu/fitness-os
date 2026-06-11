'use client';
import { Timer } from 'lucide-react';
import { useWorkoutStore } from '@/hooks/useWorkout';
import { StepperInput } from '@/components/ui/StepperInput';

export function RestTimerSettings() {
  const { defaultRestSeconds, setDefaultRestSeconds } = useWorkoutStore();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mt-6">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
        <Timer className="w-5 h-5 text-[#FF4500]" />
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Rest Timer Default</span>
      </div>
      <div className="p-4">
        <StepperInput 
          label="Seconds" 
          value={defaultRestSeconds} 
          onChange={setDefaultRestSeconds} 
          min={5} max={300} step={5} 
          unit="sec"
        />
        <p className="text-xs text-zinc-500 mt-3">This is the default rest duration triggered between sets.</p>
      </div>
    </div>
  );
}
