'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Clock, Dumbbell, Activity, XCircle, ChevronDown } from 'lucide-react';
import { getWorkoutDatesForMonth, getWorkoutDetailsForDate } from '@/actions/history';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WorkoutDetails {
  name: string
  xp: number
  durationMin: number
  calories: number
  skippedExercises: number
  skippedSets: number
  totalSets: number
  completedSets: number
  volumeKg: number
  startTime?: string
  exercises?: any[]
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workouts, setWorkouts] = useState<Record<string, number>>({}); // YYYY-MM-DD -> XP
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [workoutDetails, setWorkoutDetails] = useState<WorkoutDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getWorkoutDatesForMonth(year, month);
        const map: Record<string, number> = {};
        data.forEach((w: any) => {
          const dateObj = new Date(w.date);
          const localDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
          map[localDateStr] = (map[localDateStr] || 0) + w.xp;
        });
        setWorkouts(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    setSelectedDate(null);
    setWorkoutDetails(null);
  }, [year, month]);

  const handleDayClick = async (dateStr: string, hasWorkout: boolean) => {
    if (selectedDate === dateStr) {
      setSelectedDate(null);
      setWorkoutDetails(null);
      return;
    }
    setSelectedDate(dateStr);
    if (!hasWorkout) {
      setWorkoutDetails(null);
      return;
    }
    
    setLoadingDetails(true);
    try {
      const details = await getWorkoutDetailsForDate(dateStr);
      setWorkoutDetails(details);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const renderDays = () => {
    const days = [];
    
    // Empty slots for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 rounded-xl bg-transparent"></div>);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const xp = workouts[dateStr];
      const hasWorkout = !!xp;
      const isSelected = selectedDate === dateStr;
      
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <div 
          key={d} 
          onClick={() => handleDayClick(dateStr, hasWorkout)}
          className={`h-16 flex flex-col items-center justify-center rounded-xl border transition-all cursor-pointer ${
            hasWorkout 
              ? isSelected 
                ? 'bg-[#FF4500] border-[#FF4500] shadow-[0_0_20px_rgba(255,69,0,0.4)] text-white scale-105 z-10'
                : 'bg-[#FF4500]/10 border-[#FF4500]/30 shadow-[0_0_15px_rgba(255,69,0,0.1)] text-zinc-900 dark:text-white hover:bg-[#FF4500]/20'
              : isSelected
                ? 'bg-zinc-200 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600 text-zinc-900 dark:text-white'
                : 'bg-white dark:bg-[#161616] border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
          } ${isToday && !hasWorkout && !isSelected ? 'border-zinc-500' : ''}`}
        >
          <span className={`text-sm font-black ${isToday && !hasWorkout && !isSelected ? 'text-zinc-900 dark:text-white' : ''}`}>{d}</span>
          {hasWorkout && (
            <div className={`flex items-center gap-1 mt-1 text-[8px] font-bold uppercase tracking-widest ${isSelected ? 'text-white' : 'text-[#FF4500]'}`}>
              <Flame className="w-2.5 h-2.5" />
              {xp}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
            {monthName} {year}
          </h2>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextMonth} className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest pb-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 relative">
          {loading && (
            <div className="absolute inset-0 bg-white dark:bg-zinc-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
              <div className="w-6 h-6 border-2 border-[#FF4500]/30 border-t-[#FF4500] rounded-full animate-spin" />
            </div>
          )}
          {renderDays()}
        </div>
      </div>

      {/* Detailed Workout Card */}
      {selectedDate && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 overflow-hidden relative">
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>

          {loadingDetails ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-6 h-6 border-2 border-[#FF4500]/30 border-t-[#FF4500] rounded-full animate-spin" />
            </div>
          ) : workoutDetails ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h4 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{workoutDetails.name}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-[#FF4500] uppercase tracking-widest">
                      <Flame className="w-4 h-4" />
                      {workoutDetails.xp} XP Earned
                    </div>
                    {workoutDetails.startTime && (
                      <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 uppercase tracking-widest border-l border-zinc-200 dark:border-zinc-800 pl-4">
                        <Clock className="w-4 h-4" />
                        {new Date(workoutDetails.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-50 dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
                  </div>
                  <div className="text-xl font-black text-zinc-900 dark:text-white">{workoutDetails.durationMin} <span className="text-xs text-zinc-500 font-medium">min</span></div>
                </div>

                <div className="bg-zinc-50 dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Sets Done</span>
                  </div>
                  <div className="text-xl font-black text-zinc-900 dark:text-white">{workoutDetails.completedSets} <span className="text-xs text-zinc-500 font-medium">/ {workoutDetails.totalSets}</span></div>
                </div>

                <div className="bg-zinc-50 dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <Dumbbell className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Volume</span>
                  </div>
                  <div className="text-xl font-black text-zinc-900 dark:text-white">{workoutDetails.volumeKg.toLocaleString()} <span className="text-xs text-zinc-500 font-medium">kg</span></div>
                </div>

                <div className="bg-zinc-50 dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-zinc-500 mb-2">
                    <XCircle className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Skipped</span>
                  </div>
                  <div className="text-xl font-black text-zinc-900 dark:text-white">{workoutDetails.skippedExercises} <span className="text-xs text-zinc-500 font-medium">ex</span></div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="mt-8">
                <h5 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-4">Exercise Breakdown</h5>
                <div className="space-y-3">
                  {workoutDetails.exercises?.map((ex, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800/60">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">{ex.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${ex.completedSets === ex.totalSets ? 'bg-green-500/10 text-green-500' : ex.completedSets === 0 ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {ex.completedSets} / {ex.totalSets} Sets
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-500 font-medium">
              No workout recorded on this date.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Just reusing the calendar icon alias internally
function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
