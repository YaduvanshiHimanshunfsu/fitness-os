import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ReportHeader } from '@/components/reports/ReportHeader'
import { getWeeklyReport, getWeeklyChartData } from '@/services/analytics-service'
// getWeeklyReport is actually in report-service, my mistake, let's fix the imports.
import { getWeeklyReport as fetchWeeklyReport } from '@/services/report-service'
import { WeeklyChart } from '@/components/charts/WeeklyChart'

export default async function WeeklyReportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const report = await fetchWeeklyReport(user.id)
  const chartData = await getWeeklyChartData(user.id)

  let insight = "Tough week. Tomorrow is a fresh start."
  if (report.completionRate === 100) insight = "Perfect week. Every session completed."
  else if (report.completionRate >= 83) insight = "Strong week. One session missed."
  else if (report.completionRate >= 66) insight = "Good effort. Keep the consistency up."

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-24">
      <ReportHeader title="Weekly Report" subtitle={report.weekLabel} backHref="/reports" />

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Workouts</span>
          <span className="text-3xl font-bold text-white">{report.workoutsCompleted} <span className="text-sm text-zinc-500">/ 6</span></span>
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
      </div>

      {/* Insight */}
      <div className="bg-amber-900/10 border-l-4 border-l-amber-500 border-y border-r border-y-zinc-800 border-r-zinc-800 rounded-r-xl p-5 mb-8">
        <p className="text-amber-500 italic font-medium">"{insight}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">Activity Graph</h3>
          <WeeklyChart data={chartData} />
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold block mb-2">Best Day</span>
            <span className="text-2xl font-bold text-white block mb-1">{report.bestDay}</span>
            <span className="text-xs text-zinc-500">Most sets completed this week</span>
          </div>

          {report.missedDays.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold block mb-4">Missed Days</span>
              <div className="flex flex-wrap gap-2">
                {report.missedDays.map(day => (
                  <span key={day} className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-xs font-medium border border-zinc-700">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
