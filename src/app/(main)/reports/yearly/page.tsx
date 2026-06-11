import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ReportHeader } from '@/components/reports/ReportHeader'
import { getYearlyReport } from '@/services/report-service'
import { getYearlyChartData, getMuscleVolumeData } from '@/services/analytics-service'
import { YearlyChart } from '@/components/charts/YearlyChart'
import { MuscleVolumeChart } from '@/components/charts/MuscleVolumeChart'

export default async function YearlyReportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const report = await getYearlyReport(user.id)
  const chartData = await getYearlyChartData(user.id)
  const muscleData = await getMuscleVolumeData(user.id, 'year')

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 pb-24">
      <ReportHeader title="Yearly Report" subtitle={`${report.year} in Review`} backHref="/reports" />

      {/* Insight */}
      <div className="bg-amber-900/10 border-l-4 border-l-amber-500 border-y border-r border-y-zinc-800 border-r-zinc-800 rounded-r-xl p-5 mb-8">
        <div className="space-y-2">
          <p className="text-amber-500 italic font-medium">"You completed {report.totalWorkouts} workouts in {report.year}."</p>
          <p className="text-amber-500 italic font-medium">"Your most trained muscle group was {report.topMuscleGroup}."</p>
          <p className="text-amber-500 italic font-medium">"Your longest streak was {report.longestStreak} days — keep building on that."</p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Workouts</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-white">{report.totalWorkouts}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Sets</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-white">{report.totalSets}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Reps</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-white">{report.totalReps}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Active Hours</span>
          <span className="text-3xl font-bold text-zinc-900 dark:text-white">{report.totalActiveHours} <span className="text-sm text-zinc-500">hrs</span></span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Longest Streak</span>
          <span className="text-3xl font-bold text-amber-500">{report.longestStreak} <span className="text-sm text-zinc-500">days</span></span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col items-center justify-center">
          <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-2">Level Reached</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white text-center leading-tight mt-1">{report.levelReached}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">Yearly Activity</h3>
          <YearlyChart data={chartData} />
        </div>

        <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">Muscle Volume</h3>
          <div className="flex-1">
             <MuscleVolumeChart data={muscleData} period="year" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold block mb-2">Best Month</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white block mb-1">{report.bestMonth}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold block mb-2">Top Muscle</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white block mb-1">{report.topMuscleGroup}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <span className="text-[10px] tracking-widest uppercase text-amber-500 font-bold block mb-2">Longest Streak</span>
          <span className="text-xl font-bold text-zinc-900 dark:text-white block mb-1">{report.longestStreak} days</span>
        </div>
      </div>

      <Link href="/dashboard" className="block">
        <div className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-700 hover:scale-[1.01] transition-all border border-zinc-600 hover:border-zinc-500 rounded-xl p-6 text-center shadow-lg shadow-black/50">
          <span className="text-sm font-bold tracking-widest uppercase text-zinc-800 dark:text-zinc-100 flex items-center justify-center gap-2">
            Start {report.year + 1} Strong <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </div>
  )
}
