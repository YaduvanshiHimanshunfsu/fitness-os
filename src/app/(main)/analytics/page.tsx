import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'
import {
  getHeatmapData,
  getWeeklyChartData,
  getMonthlyChartData,
  getYearlyChartData,
  getMuscleVolumeData,
  getStreakData,
} from '@/services/analytics-service'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const userId = user.id

  const [heatmap, weekly, monthly, yearly, muscleWeek, muscleMonth, muscleYear, streak] =
    await Promise.all([
      getHeatmapData(userId, 365),
      getWeeklyChartData(userId),
      getMonthlyChartData(userId),
      getYearlyChartData(userId),
      getMuscleVolumeData(userId, 'week'),
      getMuscleVolumeData(userId, 'month'),
      getMuscleVolumeData(userId, 'year'),
      getStreakData(userId),
    ])

  return (
    <div className="p-4 sm:p-8">
      <AnalyticsDashboard
        heatmap={heatmap}
        weekly={weekly}
        monthly={monthly}
        yearly={yearly}
        muscleData={{ week: muscleWeek, month: muscleMonth, year: muscleYear }}
        streak={streak}
      />
    </div>
  )
}
