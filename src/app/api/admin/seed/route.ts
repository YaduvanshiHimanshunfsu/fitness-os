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
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }

  try {
    // Force re-seed (upsert) to fix half-seeded states where templates exist but exercises don't.

    // Seed templates
    for (const day of DAYS_OF_WEEK) {
      const { error } = await supabase.from('workout_templates').upsert({
        day: day.day,
        name: day.day.charAt(0).toUpperCase() + day.day.slice(1),
        focus: day.focus
      } as any, { onConflict: 'day' });
      if (error) throw error;
    }

    const { data: templates } = await supabase.from('workout_templates').select('id, day');
    if (!templates) throw new Error("Could not fetch templates");

    const templateMap = templates.reduce((acc: any, t: any) => {
      acc[t.day] = t.id;
      return acc;
    }, {});

    // Ensure all exercises exist in the database before linking them to templates
    for (const ex of EXERCISES) {
      const { error } = await supabase.from('exercises').upsert({
        id: ex.id,
        name: ex.name,
        muscle_group: ex.muscleGroup,
        image_url: ex.imageUrl
      } as any, { onConflict: 'id' });
      
      if (error) {
        console.error('Error seeding exercise', ex.name, error);
        throw error;
      }
    }

    // Clear old template links before re-seeding
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
      } as any);
      if (error) throw error;
    }

    return NextResponse.json({ success: true, message: 'Seeded successfully!' });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
