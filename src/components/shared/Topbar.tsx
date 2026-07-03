'use client';

import React, { useEffect, useState } from 'react';
import { Flame, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useUIStore } from '@/hooks/useUI';
import { useWorkoutStore } from '@/hooks/useWorkout';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { usePathname } from 'next/navigation';

// Live Workout Timer — only visible during an active session
function LiveWorkoutTimer({ startTime }: { startTime: Date }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const update = () => {
      setElapsed(Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  const hrs  = Math.floor(elapsed / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const secs = elapsed % 60;

  const formatted = hrs > 0
    ? `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: 20 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF4500]/20 border border-[#FF4500]/40 shadow-[0_0_20px_rgba(255,69,0,0.25)] backdrop-blur-md"
    >
      <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
      <Timer className="w-3.5 h-3.5 text-[#FF4500]" />
      <span className="font-mono text-sm font-black text-[#FF6B35] tracking-wider tabular-nums">
        {formatted}
      </span>
    </motion.div>
  );
}

function LiveDate() {
  const [dateStr, setDateStr] = useState<string>('');
  const [dayName, setDayName] = useState<string>('');
  
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'long' };
      setDayName(new Intl.DateTimeFormat('en-US', dayOptions).format(now).toUpperCase());
      const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
      setDateStr(new Intl.DateTimeFormat('en-US', dateOptions).format(now));
    };
    update();
    const interval = setInterval(update, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 w-1/3 min-w-0">
      <span className="text-sm font-black tracking-widest text-[#FF6B35] hidden sm:block truncate">
        {dayName}
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />
      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hidden md:block truncate">
        {dateStr}
      </span>
    </div>
  );
}

function LiveTime() {
  const [time, setTime] = useState<string>('');
  
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hrs  = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hrs}:${mins}:${secs}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-sm font-semibold tracking-wider text-zinc-700 dark:text-zinc-300 min-w-[70px] text-right bg-zinc-50 dark:bg-zinc-950 px-3 py-1 rounded-md border border-zinc-200 dark:border-[#1F1F1F] hidden sm:block">
      {time}
    </div>
  );
}

export default function Topbar() {
  const [streak, setStreak]   = useState<number>(0);

  const { isSidebarCollapsed }            = useUIStore();
  const { isSessionActive, startTime }    = useWorkoutStore();
  const pathname                          = usePathname();

  useEffect(() => {
    // Fetch streak from Supabase
    const fetchStreak = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase.from('streaks')
            .select('current_streak')
            .eq('user_id', user.id)
            .single();
          if (data && !error) setStreak(data.current_streak);
        }
      } catch (err) {
        console.error('Failed to fetch streak in Topbar:', err);
      }
    };
    fetchStreak();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 ${
        isSidebarCollapsed ? 'md:left-20' : 'md:left-60'
      } right-0 h-16 z-30 flex items-center justify-between px-4 sm:px-6 bg-zinc-50 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-zinc-200 dark:border-[#1F1F1F] transition-all duration-300 ease-in-out`}
    >
      {/* Left: Day & Date */}
      <LiveDate />

      {/* Center: Fitness OS Title */}
      <div className="flex justify-center items-center w-1/3">
        <span className="font-sans font-black tracking-widest text-lg text-zinc-900 dark:text-white whitespace-nowrap">
          FITNESS <span className="text-[#FF6B35]">OS</span>
        </span>
      </div>

      {/* Right: Live Timer (when active), Streak, Bell, Clock */}
      <div className="flex items-center justify-end gap-2 sm:gap-3 w-1/3">

        {/* Live Workout Timer — only during active session and on workout pages */}
        <AnimatePresence mode="wait">
          {isSessionActive && startTime && pathname.startsWith('/workout') && (
            <LiveWorkoutTimer startTime={new Date(startTime)} />
          )}
        </AnimatePresence>

        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A160F] border border-[#FF6B35]/20 shadow-[0_0_15px_rgba(255,107,53,0.08)] shrink-0">
          <Flame className="w-4 h-4 text-[#FF6B35] animate-pulse" />
          <span className="text-xs font-bold text-zinc-900 dark:text-white">
            {streak} <span className="text-zinc-500 font-normal hidden sm:inline">DAYS</span>
          </span>
        </div>

        {/* Command Palette Search */}
        <CommandPalette />

        {/* Notification Bell */}
        <NotificationBell />

        {/* Live Clock */}
        <LiveTime />
      </div>
    </header>
  );
}
