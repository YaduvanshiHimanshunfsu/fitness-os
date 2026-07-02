import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DAYS_OF_WEEK = [
  { day: 'monday', focus: 'Chest, Arms, Forearms' },
  { day: 'tuesday', focus: 'Back & Shoulders' },
  { day: 'wednesday', focus: 'Abs & Core' },
  { day: 'thursday', focus: 'Rest Day / Active Recovery' },
  { day: 'friday', focus: 'Legs & Knee Stability' },
  { day: 'saturday', focus: 'Chest & Arms Variation' },
  { day: 'sunday', focus: 'Full Body & Athletic' },
];

const EXERCISES = [
  // MONDAY
  { id: 1, name: 'Push-Ups', sets: 4, reps: '8-15', exerciseOrder: 1, day: 'monday' },
  { id: 2, name: 'Brick Chest Press', sets: 4, reps: '10-12', exerciseOrder: 2, day: 'monday' },
  { id: 3, name: 'Brick Chest Fly', sets: 3, reps: '12', exerciseOrder: 3, day: 'monday' },
  { id: 4, name: 'Alternating Bicep Curl', sets: 4, reps: '10-12', exerciseOrder: 4, day: 'monday' },
  { id: 5, name: 'Tricep Extension', sets: 4, reps: '10-12', exerciseOrder: 5, day: 'monday' },
  { id: 6, name: 'Hammer Curl', sets: 4, reps: '12', exerciseOrder: 6, day: 'monday' },
  { id: 7, name: 'Wrist Curl', sets: 4, reps: '20', exerciseOrder: 7, day: 'monday' },
  { id: 8, name: 'Farmer Hold', sets: 3, reps: '30-60 sec', exerciseOrder: 8, day: 'monday' },

  // TUESDAY
  { id: 9, name: 'Bent Over Rows', sets: 4, reps: '10-12', exerciseOrder: 1, day: 'tuesday' },
  { id: 10, name: 'Decline Brick Press', sets: 3, reps: '10', exerciseOrder: 2, day: 'tuesday' },
  { id: 11, name: 'Shoulder Press', sets: 4, reps: '10-12', exerciseOrder: 3, day: 'tuesday' },
  { id: 12, name: 'Lateral Raises', sets: 4, reps: '12-15', exerciseOrder: 4, day: 'tuesday' },
  { id: 13, name: 'Pike Push-Ups', sets: 3, reps: '8-12', exerciseOrder: 5, day: 'tuesday' },
  { id: 14, name: 'Rear Delt Fly', sets: 3, reps: '12-15', exerciseOrder: 6, day: 'tuesday' },
  { id: 15, name: 'Brick Squeeze Press', sets: 2, reps: '15', exerciseOrder: 7, day: 'tuesday' },

  // WEDNESDAY
  { id: 16, name: 'Long Arm Crunches', sets: 3, reps: '15', exerciseOrder: 1, day: 'wednesday' },
  { id: 17, name: 'Heel Taps', sets: 3, reps: '20', exerciseOrder: 2, day: 'wednesday' },
  { id: 18, name: 'Mountain Climbers', sets: 3, reps: '30 sec', exerciseOrder: 3, day: 'wednesday' },
  { id: 19, name: 'Reverse Crunch', sets: 3, reps: '12', exerciseOrder: 4, day: 'wednesday' },
  { id: 20, name: 'Plank', sets: 3, reps: '30-45 sec', exerciseOrder: 5, day: 'wednesday' },

  // FRIDAY
  { id: 21, name: 'Squats', sets: 4, reps: '12-15', exerciseOrder: 1, day: 'friday' },
  { id: 22, name: 'Backward Lunges', sets: 3, reps: '10-12', exerciseOrder: 2, day: 'friday' },
  { id: 23, name: 'Glute Bridge', sets: 3, reps: '15', exerciseOrder: 3, day: 'friday' },
  { id: 24, name: 'Side Lunges', sets: 3, reps: '10', exerciseOrder: 4, day: 'friday' },
  { id: 25, name: 'Calf Raises', sets: 4, reps: '20', exerciseOrder: 5, day: 'friday' },
  { id: 26, name: 'Wall Sit', sets: 2, reps: '45 sec', exerciseOrder: 6, day: 'friday' },

  // SATURDAY
  { id: 27, name: 'Decline Push-Ups', sets: 3, reps: '8-12', exerciseOrder: 1, day: 'saturday' },
  { id: 28, name: 'Hindu Push-Ups', sets: 3, reps: '8-10', exerciseOrder: 2, day: 'saturday' },
  { id: 29, name: 'Brick Squeeze Press', sets: 3, reps: '12-15', exerciseOrder: 3, day: 'saturday' },
  { id: 30, name: 'Arnold Press', sets: 4, reps: '10', exerciseOrder: 4, day: 'saturday' },
  { id: 31, name: 'Tricep Dips', sets: 3, reps: '12-15', exerciseOrder: 5, day: 'saturday' },
  { id: 32, name: 'Dumbbell Kickbacks', sets: 3, reps: '12-15', exerciseOrder: 6, day: 'saturday' },
  { id: 33, name: 'Hammer Curl', sets: 3, reps: '12', exerciseOrder: 7, day: 'saturday' },
  { id: 34, name: 'Reverse Wrist Curl', sets: 4, reps: '20', exerciseOrder: 8, day: 'saturday' },
  { id: 35, name: 'Farmer Hold', sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'saturday' },

  // SUNDAY
  { id: 36, name: 'Floor Press', sets: 4, reps: '12', exerciseOrder: 1, day: 'sunday' },
  { id: 37, name: 'Bent Over Rows', sets: 4, reps: '12', exerciseOrder: 2, day: 'sunday' },
  { id: 38, name: 'Step-Ups', sets: 3, reps: '10', exerciseOrder: 3, day: 'sunday' },
  { id: 39, name: 'Backward Lunges', sets: 3, reps: '10', exerciseOrder: 4, day: 'sunday' },
  { id: 40, name: 'Push-Ups', sets: 3, reps: '10-15', exerciseOrder: 5, day: 'sunday' },
  { id: 41, name: 'Hammer Curl', sets: 3, reps: '12', exerciseOrder: 6, day: 'sunday' },
  { id: 42, name: 'Plank', sets: 3, reps: '45 sec', exerciseOrder: 7, day: 'sunday' },
  { id: 43, name: 'Burpees', sets: 2, reps: '8', exerciseOrder: 8, day: 'sunday' },
  { id: 44, name: 'Farmer Hold', sets: 3, reps: '30-60 sec', exerciseOrder: 9, day: 'sunday' }
];

async function seed() {
  console.log("Seeding workout_templates...");
  
  for (const day of DAYS_OF_WEEK) {
    const { error } = await supabase.from('workout_templates').upsert({
      day: day.day,
      name: day.day.charAt(0).toUpperCase() + day.day.slice(1),
      focus: day.focus
    }, { onConflict: 'day' });
    
    if (error) console.error("Error inserting template for", day.day, error);
  }

  // Get template IDs
  const { data: templates } = await supabase.from('workout_templates').select('id, day');
  if (!templates) throw new Error("Could not fetch templates");

  const templateMap = templates.reduce((acc, t) => {
    acc[t.day] = t.id;
    return acc;
  }, {} as Record<string, number>);

  console.log("Seeding workout_template_exercises...");
  for (const ex of EXERCISES) {
    const templateId = templateMap[ex.day];
    if (!templateId) {
      console.warn("No template found for day:", ex.day);
      continue;
    }

    const { error } = await supabase.from('workout_template_exercises').insert({
      template_id: templateId,
      exercise_id: ex.id,
      sets: ex.sets,
      reps: ex.reps,
      exercise_order: ex.exerciseOrder
    }); 
    if (error) console.error("Error inserting exercise", ex.name, error);
  }

  console.log("Done!");
}

async function cleanAndSeed() {
  console.log("Cleaning old template exercises...");
  await supabase.from('workout_template_exercises').delete().neq('id', -1);
  
  await seed();
}

cleanAndSeed();
