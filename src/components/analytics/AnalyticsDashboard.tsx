'use client'
import { useState } from 'react'
import { PageHeader } from './PageHeader'
import { LifetimeStatsRow } from './LifetimeStatsRow'
import { PeriodTabs, Period } from './PeriodTabs'
import { StreakCard } from './StreakCard'
import { WorkoutHeatmap } from '@/components/heatmap/WorkoutHeatmap'
import { WeeklyChart } from '@/components/charts/WeeklyChart'
import { MonthlyChart } from '@/components/charts/MonthlyChart'
import { YearlyChart } from '@/components/charts/YearlyChart'
import { MuscleVolumeChart } from '@/components/charts/MuscleVolumeChart'

import type { HeatmapDay, StreakData, WeeklyChartData, MonthlyChartData, YearlyChartData, MuscleVolumeData } from '@/services/analytics-service'

export default function AnalyticsDashboard({
  heatmap,
  weekly,
  monthly,
  yearly,
  muscleData,
  streak
}: {
  heatmap: HeatmapDay[]
  weekly: WeeklyChartData[]
  monthly: MonthlyChartData[]
  yearly: YearlyChartData[]
  muscleData: { week: MuscleVolumeData[], month: MuscleVolumeData[], year: MuscleVolumeData[] }
  streak: StreakData
}) {
  const [period, setPeriod] = useState<Period>('week')

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <PageHeader title="Analytics" subtitle="Your progress, visualised" />
      
      <LifetimeStatsRow 
        totalWorkouts={streak.totalWorkouts} 
        totalSets={streak.totalSets} 
        totalReps={streak.totalReps} 
        bestStreak={streak.bestStreak} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <WorkoutHeatmap data={heatmap} />
        </div>
        <div className="lg:col-span-1">
          <StreakCard 
            currentStreak={streak.currentStreak} 
            bestStreak={streak.bestStreak} 
            lastWorkoutDate={streak.lastWorkoutDate} 
          />
        </div>
      </div>

      <PeriodTabs period={period} onChange={setPeriod} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">Activity (Sets)</h3>
          {period === 'week' && <WeeklyChart key="weekly" data={weekly} />}
          {period === 'month' && <MonthlyChart key="monthly" data={monthly} />}
          {period === 'year' && <YearlyChart key="yearly" data={yearly} />}
        </div>
        
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">Muscle Volume</h3>
          <MuscleVolumeChart key={`muscle-${period}`} data={muscleData[period]} period={period} />
        </div>
      </div>
    </div>
  )
}
