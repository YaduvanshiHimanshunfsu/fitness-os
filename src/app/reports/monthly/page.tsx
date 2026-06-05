import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ReportHeader } from '@/components/reports/ReportHeader'
import { getMonthlyReport } from '@/services/report-service'
import { getMonthlyChartData, getMuscleVolumeData } from '@/services/analytics-service'
import { MonthlyChart } from '@/components/charts/MonthlyChart'
import { MuscleVolumeChart } from '@/components/charts/MuscleVolumeChart'

export default async function MonthlyReportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const report = await getMonthlyReport(user.id)
  const chartData = await getMonthlyChartData(user.id)
  const muscleData = await getMuscleVolumeData(user.id, 'month')

  let insight = "Tough month. Refocus for next month."
  if (report.completionRate === 100) insight = "Flawless month. You showed up every single day."
  else if (report.completionRate >= 75) insight = "Solid month. Strong consistency across the board."
  else if (report.completionRate >= 50) insight = "Decent month. Room to push harder and stay consistent."

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 pb-24">
      <ReportHeader title="Monthly Report" subtitle={report.monthLabel} backHref="/reports" />

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Workouts</span>
          <span className="text-3xl font-bold text-white">{report.workoutsCompleted}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Sets</span>
          <span className="text-3xl font-bold text-white">{report.totalSets}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Reps</span>
          <span className="text-3xl font-bold text-white">{report.totalReps}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Completion</span>
          <span className="text-3xl font-bold text-white">{report.completionRate}%</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center md:col-span-1 col-span-2">
          <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-2">Best Streak</span>
          <span className="text-3xl font-bold text-white">{report.bestStreak} <span className="text-sm text-zinc-500">days</span></span>
        </div>
      </div>

      {/* Insight */}
      <div className="bg-amber-900/10 border-l-4 border-l-amber-500 border-y border-r border-y-zinc-800 border-r-zinc-800 rounded-r-xl p-5 mb-8">
        <p className="text-amber-500 italic font-medium">"{insight}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">Activity Graph</h3>
          <MonthlyChart data={chartData} />
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex-1">
            <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">Muscle Volume</h3>
            <MuscleVolumeChart data={muscleData} period="month" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold block mb-2">Most Trained</span>
          <span className="text-2xl font-bold text-white block mb-1">{report.topMuscleGroup}</span>
          <span className="text-xs text-zinc-500">Based on total sets this month</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold block mb-2">Best Week</span>
          <span className="text-2xl font-bold text-white block mb-1">{report.bestWeek}</span>
          <span className="text-xs text-zinc-500">Highest volume 7-day span</span>
        </div>
      </div>
    </div>
  )
}
