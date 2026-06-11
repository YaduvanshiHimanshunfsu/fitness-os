'use server';

import { createClient } from '@/lib/supabase/server';

export interface BodyMetric {
  id: number;
  user_id: string;
  weight_kg: number;
  body_fat_percentage: number | null;
  measured_at: string;
  notes: string | null;
}

export async function addBodyMetric(weightKg: number, bodyFatPercentage?: number | null, notes?: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('body_metrics')
    .insert({
      user_id: user.id,
      weight_kg: weightKg,
      body_fat_percentage: bodyFatPercentage ?? null,
      notes: notes ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding body metric:', error);
    throw new Error('Failed to save body metric');
  }

  return data as BodyMetric;
}

export async function getBodyMetrics(): Promise<BodyMetric[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('body_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('measured_at', { ascending: true }); // ASC for charting

  if (error) {
    console.error('Error fetching body metrics:', error);
    return [];
  }

  return data as BodyMetric[];
}
