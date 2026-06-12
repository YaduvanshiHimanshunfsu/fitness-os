-- Run this in your Supabase SQL Editor to fix the missing Analytics!

-- 1. Fix RLS on the old V1 tables so the dashboard can actually read them
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table workout_sets enable row level security;

drop policy if exists "Users read own workouts" on workouts;
create policy "Users read own workouts" on workouts for select using (profile_id = auth.uid());

drop policy if exists "Users read own workout_exercises" on workout_exercises;
create policy "Users read own workout_exercises" on workout_exercises for select using (
  workout_id in (select id from workouts where profile_id = auth.uid())
);

drop policy if exists "Users read own workout_sets" on workout_sets;
create policy "Users read own workout_sets" on workout_sets for select using (
  workout_exercise_id in (
    select id from workout_exercises where workout_id in (
      select id from workouts where profile_id = auth.uid()
    )
  )
);

-- 2. Create the Materialized View for the Weekly Chart (if missing)
drop materialized view if exists mv_weekly_volume;
create materialized view mv_weekly_volume as
select 
  w.profile_id,
  date_trunc('week', w.start_time) as week_start,
  count(ws.id) filter (where ws.completed = true) as sets_completed
from workouts w
join workout_exercises we on w.id = we.workout_id
join workout_sets ws on we.id = ws.workout_exercise_id
group by 1, 2;

-- Allow users to read from the materialized view
grant select on mv_weekly_volume to authenticated;
grant select on mv_weekly_volume to anon;
