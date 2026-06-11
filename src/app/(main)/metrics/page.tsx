import { PageHeader } from '@/components/analytics/PageHeader';
import { BodyMetricsClient } from '@/components/metrics/BodyMetricsClient';
import { getBodyMetrics } from '@/services/metrics-service';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MetricsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const initialMetrics = await getBodyMetrics();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-24">
      <PageHeader 
        title="Body Metrics" 
        subtitle="Track your weight, body fat %, and compute BMI over time"
      />
      <div className="mt-8">
        <BodyMetricsClient initialMetrics={initialMetrics} />
      </div>
    </div>
  );
}
