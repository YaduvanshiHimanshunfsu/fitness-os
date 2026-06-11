import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/analytics/PageHeader'
import { Bell, Moon, Download, LogOut, ChevronRight } from 'lucide-react'
import { logout } from '@/actions/auth'
import { RestTimerSettings } from '@/components/settings/RestTimerSettings'

import { ThemeToggle } from '@/components/settings/ThemeToggle'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 pb-24">
      <PageHeader title="Settings" subtitle="Preferences and account management" />

      <div className="space-y-6">
        {/* App Preferences */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 px-2">App Preferences</h3>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Dark Mode</span>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-200 dark:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </div>
          </div>
          <RestTimerSettings />
        </section>

        {/* Data & Privacy */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 px-2">Data & Privacy</h3>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-200 dark:bg-zinc-800/50 transition-colors border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Export Workout Data</span>
                  <span className="text-xs text-zinc-500">Download your history as CSV</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </div>
          </div>
        </section>

        {/* Account */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 px-2">Account</h3>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <form action={logout}>
              <button type="submit" className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-red-500/10 transition-colors text-red-500">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Log Out</span>
                </div>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
