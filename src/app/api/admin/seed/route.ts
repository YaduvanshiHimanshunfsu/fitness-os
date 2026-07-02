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

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Temporary bypass for seeding
  // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // const { data: profile } = await supabase.from('profiles').select('role, email').eq('id', user.id).single();
  // if (profile?.role !== 'admin' && profile?.email !== 'himanshu.btmtcs4242906@nfsu.ac.in') {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }

  try {
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

    // First delete old template exercises
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
