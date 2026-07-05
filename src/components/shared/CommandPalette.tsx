'use client';

import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Search, Home, Dumbbell, User, Settings, Award, Trophy, Bot, Activity, Flame } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Exercise } from '@/types/exercise';
import { AnimatePresence, motion } from 'framer-motion';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('exercises').select('*');
      if (data) setExercises(data as any[]);
    };
    fetchExercises();
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-500 transition-colors mr-2"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 font-mono text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400 font-medium">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col"
            >
              <Command 
                value={search} 
                onValueChange={setSearch} 
                className="w-full flex flex-col bg-transparent"
                loop
              >
                <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
                  <Search className="w-5 h-5 text-zinc-500 shrink-0" />
                  <Command.Input 
                    autoFocus
                    placeholder="Search workouts, pages, or exercises..."
                    className="flex-1 px-4 py-4 bg-transparent outline-none text-zinc-900 dark:text-white placeholder:text-zinc-500 text-[15px]"
                  />
                  <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 font-medium">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                  <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="text-xs font-semibold text-zinc-500 px-2 py-2 mb-1">
                    <Command.Item 
                      onSelect={() => runCommand(() => router.push('/dashboard'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800/50 aria-selected:text-zinc-900 dark:aria-selected:text-white"
                    >
                      <Home className="w-4 h-4 text-zinc-400" />
                      Dashboard
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => router.push('/coach'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800/50 aria-selected:text-zinc-900 dark:aria-selected:text-white"
                    >
                      <Bot className="w-4 h-4 text-[#FF6B35]" />
                      AI Fitness Coach
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => router.push('/community'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800/50 aria-selected:text-zinc-900 dark:aria-selected:text-white"
                    >
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      Community Leaderboard
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => router.push('/analytics'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800/50 aria-selected:text-zinc-900 dark:aria-selected:text-white"
                    >
                      <Activity className="w-4 h-4 text-blue-400" />
                      Analytics & Progress
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => router.push('/settings'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800/50 aria-selected:text-zinc-900 dark:aria-selected:text-white"
                    >
                      <Settings className="w-4 h-4 text-zinc-400" />
                      Settings & Data Export
                    </Command.Item>
                  </Command.Group>

                  {exercises.length > 0 && (
                    <Command.Group heading="Exercises" className="text-xs font-semibold text-zinc-500 px-2 py-2 mt-2 mb-1">
                      {exercises.map((exercise) => (
                        <Command.Item 
                          key={exercise.id}
                          onSelect={() => runCommand(() => router.push(`/workout?exercise=${exercise.id}`))}
                          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800/50 aria-selected:text-zinc-900 dark:aria-selected:text-white"
                        >
                          <div className="flex items-center gap-3">
                            <Dumbbell className="w-4 h-4 text-zinc-400" />
                            <span>{exercise.name}</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 capitalize">
                            {(exercise as any).muscle_group}
                          </span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}
                </Command.List>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
