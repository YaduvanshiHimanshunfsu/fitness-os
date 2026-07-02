import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/analytics/PageHeader'

export const dynamic = 'force-dynamic'
import { getPersonalRecords } from '@/services/record-service'
import { getStreakData } from '@/services/analytics-service'
import { Trophy, Dumbbell, Timer, Flame, Clock, Activity, Zap } from 'lucide-react'

export default async function RecordsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const records = await getPersonalRecords(user.id)
  const streakData = await getStreakData(user.id)

  const hours = Math.floor(streakData.totalDurationMinutes / 60)
  const minutes = streakData.totalDurationMinutes % 60

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-24 space-y-12">
      <div>
        <PageHeader title="Consistency & Dedication" subtitle="Your lifetime training statistics" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-[#FF6B35]" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Best Streak</span>
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              {streakData.bestStreak} <span className="text-sm text-zinc-500 font-medium">Days</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Time</span>
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              {hours > 0 && <>{hours}<span className="text-sm text-zinc-500 font-medium mr-1">h</span></>}
              {minutes}<span className="text-sm text-zinc-500 font-medium">m</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-purple-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Workouts</span>
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              {streakData.totalWorkouts}
            </div>
          </div>

          <div className="bg-white dark:bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sets Done</span>
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white leading-none">
              {streakData.totalSets.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div>
        <PageHeader title="Personal Records" subtitle="Your all-time best performances" />

      {records.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Records Yet</h3>
          <p className="text-sm text-zinc-500">Complete workouts to set your first personal records.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map((record) => {
            const hasReps = record.max_reps !== null
            const hasWeight = record.max_weight !== null
            const hasHold = record.longest_hold_seconds !== null

            return (
              <div key={record.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-amber-500 mb-1 block">
                      {record.muscle_group}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-zinc-900 dark:text-white transition-colors">
                      {record.exercise_name}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 shrink-0 group-hover:text-amber-500 transition-colors">
                    {hasHold ? <Timer className="w-4 h-4" /> : <Dumbbell className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                  {hasReps && (
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Max Reps</span>
                      <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">{record.max_reps}</span>
                    </div>
                  )}
                  {hasWeight && (
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Max Weight</span>
                      <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">{record.max_weight} <span className="text-xs text-zinc-500">kg</span></span>
                    </div>
                  )}
                  {hasHold && (
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block mb-1">Longest Hold</span>
                      <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">{record.longest_hold_seconds} <span className="text-xs text-zinc-500">sec</span></span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-[10px] font-medium text-zinc-600">
                  Set on {new Date(record.achieved_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            )
          })}
        </div>
      )}
      </div>
    </div>
  )
}
