-- 1. Enable RLS on the tables (if not already enabled)
alter table workout_templates enable row level security;
alter table workout_template_exercises enable row level security;

-- 2. Drop existing policies to be safe
drop policy if exists "templates_public_read" on workout_templates;
drop policy if exists "templates_admin_all" on workout_templates;
drop policy if exists "template_exercises_public_read" on workout_template_exercises;
drop policy if exists "template_exercises_admin_all" on workout_template_exercises;

-- 3. Create Public Read Policies
create policy "templates_public_read" on workout_templates for select using (true);
create policy "template_exercises_public_read" on workout_template_exercises for select using (true);

-- 4. Create Admin All Policies
create policy "templates_admin_all" on workout_templates for all using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "template_exercises_admin_all" on workout_template_exercises for all using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
