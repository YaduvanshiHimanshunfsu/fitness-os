import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { EXERCISES } from '@/constants/exercises';

const DAYS_OF_WEEK = [
  { day: 'monday', focus: 'Chest, Arms, Forearms' },
  { day: 'tuesday', focus: 'Back & Shoulders' },
  { day: 'wednesday', focus: 'Abs & Core' },
  { day: 'thursday', focus: 'Rest Day / Active Recovery' },
  { day: 'friday', focus: 'Legs & Knee Stability' },
  { day: 'saturday', focus: 'Chest & Arms Variation' },
  { day: 'sunday', focus: 'Full Body & Athletic' },
];

export async function POST() {
  return GET();
}

export async function GET() {
  // Use authenticated client so RLS allows admin insertions
  const supabase = await createClient();

  try {
    // Check if already seeded
    const { count } = await supabase.from('workout_templates').select('*', { count: 'exact', head: true });
    if (count && count > 0) {
      return NextResponse.json({ success: true, message: 'Already seeded!', templates: count });
    }

    // Seed templates
    for (const day of DAYS_OF_WEEK) {
      const { error } = await supabase.from('workout_templates').upsert({
        day: day.day,
        name: day.day.charAt(0).toUpperCase() + day.day.slice(1),
        focus: day.focus
      }, { onConflict: 'day' });
      if (error) throw error;
    }

    const { data: templates } = await supabase.from('workout_templates').select('id, day');
    if (!templates) throw new Error("Could not fetch templates");

    const templateMap = templates.reduce((acc: any, t: any) => {
      acc[t.day] = t.id;
      return acc;
    }, {});

    // Clear old exercises before re-seeding
    await supabase.from('workout_template_exercises').delete().neq('id', -1);

    for (const ex of EXERCISES) {
      const templateId = templateMap[ex.day];
      if (!templateId) continue;

      const { error } = await supabase.from('workout_template_exercises').insert({
        template_id: templateId,
        exercise_id: ex.id,
        sets: ex.sets,
        reps: ex.reps,
        exercise_order: ex.exerciseOrder
      });
      if (error) throw error;
    }

    return NextResponse.json({ success: true, message: 'Seeded successfully!' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
