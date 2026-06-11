import { PageHeader } from '@/components/analytics/PageHeader'
import { Calendar } from '@/components/history/Calendar'

export const dynamic = 'force-dynamic'

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-24">
      <PageHeader 
        title="History" 
        subtitle="Track your consistency and past workouts"
      />
      
      <div className="mt-8">
        <Calendar />
      </div>
    </div>
  )
}
