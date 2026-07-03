import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkDb() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: templates, error: tErr } = await supabase.from('workout_templates').select('*');
  console.log('Templates:', templates?.length, tErr);

  const { data: exercises, error: eErr } = await supabase.from('workout_template_exercises').select('*');
  console.log('Exercises:', exercises?.length, eErr);
}

checkDb();
