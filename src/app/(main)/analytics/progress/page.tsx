import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/analytics/PageHeader'
import { getPersonalRecords } from '@/services/record-service'
import { Flame, Trophy, Activity, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProgressiveOverloadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const records = await getPersonalRecords(user.id)

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-24">
      <PageHeader 
        title="Progressive Overload" 
        subtitle="Track your estimated 1RM and volume growth over time"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {records.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No Records Yet</h3>
            <p className="text-zinc-500">Complete workouts with weight tracking to start building your progressive overload history.</p>
          </div>
        )}

        {records.map((record) => (
          <div key={record.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4500]/5 rounded-bl-full pointer-events-none transition-colors group-hover:bg-[#FF4500]/10" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-[#FF4500] uppercase tracking-widest bg-[#FF4500]/10 px-2 py-1 rounded-md">
                  {record.muscle_group}
                </span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mt-3">
                  {record.exercise_name}
                </h3>
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Estimated 1RM</div>
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none">
                    {record.estimated_1rm ? Math.round(record.estimated_1rm) : '--'}
                  </span>
                  <span className="text-xs font-bold text-zinc-500 uppercase pb-0.5">kg</span>
                </div>
              </div>

              <div className="bg-[#161616] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Max Volume</div>
                <div className="flex items-end gap-1.5">
                  <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none">
                    {record.max_weight || '--'} <span className="text-xs text-zinc-500">×</span> {record.max_reps || '--'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4 relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                <Flame className="w-3 h-3 text-[#FF4500]" />
                Last broken: {new Date(record.achieved_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
