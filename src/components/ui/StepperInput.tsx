'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepperInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
}

export function StepperInput({ value, onChange, min = 0, max = 999, step = 1, label, unit }: StepperInputProps) {
  const [isPressing, setIsPressing] = useState<number | null>(null); // +1 or -1
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const intervalTimer = useRef<NodeJS.Timeout | null>(null);

  const increment = useCallback((dir: number) => {
    onChange(Math.min(max, Math.max(min, value + dir * step)));
  }, [value, min, max, step, onChange]);

  const handlePointerDown = (dir: number) => {
    increment(dir);
    setIsPressing(dir);
    pressTimer.current = setTimeout(() => {
      intervalTimer.current = setInterval(() => {
        onChange(curr => Math.min(max, Math.max(min, curr + dir * step)));
      }, 80); // Fast increment
    }, 500); // Wait 500ms before auto-incrementing
  };

  const handlePointerUp = () => {
    setIsPressing(null);
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (intervalTimer.current) clearInterval(intervalTimer.current);
  };

  useEffect(() => {
    return handlePointerUp; // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>}
      <div className="flex items-center justify-between bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 select-none h-[60px]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onPointerDown={() => handlePointerDown(-1)}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-16 h-12 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-zinc-900 dark:text-white"
        >
          <Minus className="w-5 h-5 mb-0.5" />
          <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Subtract</span>
        </motion.button>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-zinc-900 dark:text-white leading-none">{Number.isInteger(value) ? value : value.toFixed(1)}</span>
          {unit && <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{unit}</span>}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onPointerDown={() => handlePointerDown(1)}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-16 h-12 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-zinc-900 dark:text-white"
        >
          <Plus className="w-5 h-5 mb-0.5" />
          <span className="text-[7px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Add</span>
        </motion.button>
      </div>
    </div>
  );
}
