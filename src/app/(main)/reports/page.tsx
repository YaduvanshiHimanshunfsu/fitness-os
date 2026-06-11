import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Calendar, BarChart2, Activity } from 'lucide-react'

export default async function ReportsIndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-24">
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-8">
        <h1 className="text-2xl font-bold tracking-widest uppercase text-zinc-900 dark:text-white mb-2">Reports</h1>
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Deep dive into your performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Weekly Report */}
        <Link href="/reports/weekly" className="group block">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-zinc-600 group-hover:shadow-lg group-hover:shadow-black/50 h-full flex flex-col">
            <div className="mb-4 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:text-white transition-colors">
              <Activity className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold tracking-widest uppercase text-zinc-900 dark:text-white mb-2">Weekly Report</h2>
            <p className="text-sm text-zinc-500 mb-6 flex-1">Analyze your sets, completion rates, and daily consistency from Monday to Sunday.</p>
            
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:text-zinc-100 transition-colors">
              View Week <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </Link>

        {/* Monthly Report */}
        <Link href="/reports/monthly" className="group block">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-zinc-600 group-hover:shadow-lg group-hover:shadow-black/50 h-full flex flex-col">
            <div className="mb-4 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:text-white transition-colors">
              <BarChart2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold tracking-widest uppercase text-zinc-900 dark:text-white mb-2">Monthly Report</h2>
            <p className="text-sm text-zinc-500 mb-6 flex-1">Review your best weeks, top muscle groups, and overall monthly progress trends.</p>
            
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:text-zinc-100 transition-colors">
              View Month <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </Link>

        {/* Yearly Report */}
        <Link href="/reports/yearly" className="group block">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-zinc-600 group-hover:shadow-lg group-hover:shadow-black/50 h-full flex flex-col">
            <div className="mb-4 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:text-white transition-colors">
              <Calendar className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold tracking-widest uppercase text-zinc-900 dark:text-white mb-2">Yearly Report</h2>
            <p className="text-sm text-zinc-500 mb-6 flex-1">Your entire year in review. See how many hours you put in and what level you reached.</p>
            
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:text-zinc-100 transition-colors">
              View Year <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  )
}
