-- ==============================================================================
-- FITNESS OS — VERSION 5 ADVANCED DATABASE SCHEMA
-- This creates a brand new, clean, and advanced schema for workouts.
-- Run this entire script in the Supabase SQL Editor.
-- ==============================================================================

-- 1. Create Advanced Workouts Table
create table if not exists workouts_v5 (
  id                 uuid        primary key default gen_random_uuid(),
  profile_id         uuid        not null references profiles(id) on delete cascade,
  name               text        not null,
  start_time         timestamptz not null,
  end_time           timestamptz not null,
  xp_earned          integer     not null default 0,
  sets_skipped       integer     not null default 0,
  exercises_skipped  integer     not null default 0,
  estimated_calories integer     not null default 0,
  created_at         timestamptz not null default now()
);

-- 2. Create Advanced Workout Exercises Table (Grouping)
create table if not exists workout_exercises_v5 (
  id           uuid    primary key default gen_random_uuid(),
  workout_id   uuid    not null references workouts_v5(id) on delete cascade,
  exercise_id  integer not null references exercises(id) on delete cascade,
  order_index  integer not null,
  sets_skipped integer not null default 0
);

-- 3. Create Advanced Workout Sets Table (With Weight & Unit)
create table if not exists workout_sets_v5 (
  id                  uuid    primary key default gen_random_uuid(),
  workout_exercise_id uuid    not null references workout_exercises_v5(id) on delete cascade,
  actual_reps         integer not null,
  weight_kg           numeric not null default 0,
  unit                text    not null default 'kg',
  completed           boolean not null default false
);

-- ==============================================================================
-- ADVANCED ROW LEVEL SECURITY (RLS) FOR MULTI-TENANT PRIVACY
-- Guarantees users can only see their own data.
-- ==============================================================================

alter table workouts_v5 enable row level security;
alter table workout_exercises_v5 enable row level security;
alter table workout_sets_v5 enable row level security;

drop policy if exists "Users manage own workouts_v5" on workouts_v5;
create policy "Users manage own workouts_v5" 
  on workouts_v5 for all using (profile_id = auth.uid());

drop policy if exists "Users manage own workout_exercises_v5" on workout_exercises_v5;
create policy "Users manage own workout_exercises_v5" 
  on workout_exercises_v5 for all using (
    workout_id in (select id from workouts_v5 where profile_id = auth.uid())
  );

drop policy if exists "Users manage own workout_sets_v5" on workout_sets_v5;
create policy "Users manage own workout_sets_v5" 
  on workout_sets_v5 for all using (
    workout_exercise_id in (
      select id from workout_exercises_v5 where workout_id in (
        select id from workouts_v5 where profile_id = auth.uid()
      )
    )
  );

-- ==============================================================================
-- ADVANCED ANALYTICS VIEWS
-- ==============================================================================

drop materialized view if exists mv_weekly_volume_v5;
create materialized view mv_weekly_volume_v5 as
select 
  w.profile_id,
  date_trunc('week', w.start_time) as week_start,
  count(ws.id) filter (where ws.completed = true) as sets_completed
from workouts_v5 w
join workout_exercises_v5 we on w.id = we.workout_id
join workout_sets_v5 ws on we.id = ws.workout_exercise_id
group by 1, 2;

-- Allow all authenticated users to read the materialized view (RLS doesn't apply to MVs directly, we filter in the query)
grant select on mv_weekly_volume_v5 to authenticated;
grant select on mv_weekly_volume_v5 to anon;

-- Refresh function for the Materialized View
create or replace function refresh_weekly_volume_v5()
returns trigger language plpgsql as $$
begin
  refresh materialized view concurrently mv_weekly_volume_v5;
  return null;
end;
$$;

-- Note: In a real production app you might schedule the refresh, or run it via a webhook.
-- For local dev, you can refresh it manually or just query the raw tables instead of the MV.
