'use client'
import { motion } from 'framer-motion'
import { heatmapReveal } from '@/lib/animations'
import { HeatmapDay } from '@/services/analytics-service'
import { HeatmapCell } from './HeatmapCell'

export function WorkoutHeatmap({ data }: { data: HeatmapDay[] }) {
  // We need to format the data into a 52x7 grid
  // To keep it simple, we'll chunk the flat array into weeks.
  // The data provided should ideally end on 'today' and start 365 days ago.
  
  const totalWorkouts = data.filter(d => d.completed).length

  // Build grid: columns are weeks (from oldest to newest), rows are days of the week (Sun-Sat)
  // First, find the day of the week for the first entry
  const weeks: HeatmapDay[][] = []
  let currentWeek: HeatmapDay[] = []

  const firstDate = new Date(data[0]?.date || Date.now())
  const startDay = firstDate.getDay() // 0 = Sunday

  // Fill initial empty cells if the first day isn't Sunday
  for (let i = 0; i < startDay; i++) {
    const d = new Date(firstDate)
    d.setDate(d.getDate() - (startDay - i))
    currentWeek.push({
      date: d.toISOString().split('T')[0],
      completed: false,
      isRestDay: false
    })
  }

  for (const day of data) {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  // Handle last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      const lastDay = new Date(currentWeek[currentWeek.length - 1].date)
      lastDay.setDate(lastDay.getDate() + 1)
      currentWeek.push({
        date: lastDay.toISOString().split('T')[0],
        completed: false,
        isRestDay: false
      })
    }
    weeks.push(currentWeek)
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500">Workout Activity</h3>
        <span className="text-xs text-zinc-500 font-medium">{totalWorkouts} workouts this year</span>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <div className="min-w-max flex gap-[2px]">
          {weeks.map((week, colIndex) => (
            <motion.div 
              key={colIndex}
              custom={colIndex}
              variants={heatmapReveal}
              initial="initial"
              animate="animate"
              // Custom variant delay based on column index
              transition={{ delay: colIndex * 0.008 }} 
              className="flex flex-col gap-[2px]"
            >
              {week.map((day) => {
                const isToday = day.date === todayStr
                const isFuture = new Date(day.date) > new Date()
                return (
                  <HeatmapCell
                    key={day.date}
                    date={day.date}
                    completed={day.completed}
                    isRestDay={day.isRestDay}
                    isToday={isToday}
                    isFuture={isFuture}
                  />
                )
              })}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mt-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
        <div className="flex items-center gap-1.5">
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-300" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-800" />
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[10px] h-[10px] rounded-[2px] bg-zinc-900 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.06)_2px,rgba(255,255,255,0.06)_4px)] border border-zinc-800" />
          <span>Rest Day</span>
        </div>
      </div>
    </div>
  )
}
