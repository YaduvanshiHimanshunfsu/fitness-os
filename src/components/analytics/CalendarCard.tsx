'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, subMonths, addMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import type { HeatmapDay } from '@/services/analytics-service';

interface CalendarCardProps {
  heatmap: HeatmapDay[];
  currentStreak: number;
}

export function CalendarCard({ heatmap, currentStreak }: CalendarCardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const activeDates = new Set(
    heatmap.filter(d => d.completed).map(d => d.date)
  );

  return (
    <div className="bg-zinc-50 dark:bg-[#0A0A0A]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Streak Header */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5 relative z-10">
        <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-900 dark:text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#FF4500]" /> Workout Calendar
        </h3>
        <div className="flex items-center gap-2 bg-[#FF4500]/10 border border-[#FF4500]/20 px-3 py-1 rounded-full">
          <span className="text-[10px] font-bold text-[#FF4500] uppercase tracking-widest">Streak</span>
          <span className="text-sm font-black text-zinc-900 dark:text-white">{currentStreak}</span>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-lg font-black text-zinc-900 dark:text-white tracking-tight uppercase">
          {format(currentDate, 'MMMM yyyy')}
        </span>
        <div className="flex gap-1">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors border border-transparent hover:border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors border border-transparent hover:border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2 relative z-10">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <div key={i} className="text-center text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 relative z-10">
        {days.map((day, dayIdx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isWorkoutDay = activeDates.has(dateStr);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={day.toString()} 
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all relative group ${
                !isCurrentMonth ? 'text-zinc-700' : 
                isWorkoutDay ? 'bg-gradient-to-tr from-[#FF4500] to-[#FF8C61] text-zinc-900 dark:text-white shadow-[0_0_15px_rgba(255,69,0,0.3)] border border-[#FF4500]/50' : 
                'text-zinc-700 dark:text-zinc-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="relative z-10">{format(day, 'd')}</span>
              {isToday && !isWorkoutDay && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-zinc-400" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
