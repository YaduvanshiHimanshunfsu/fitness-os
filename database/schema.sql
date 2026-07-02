-- ==============================================================================
-- FITNESS OS — COMPLETE DATABASE SCHEMA
-- Version: 6.0 (Production-Grade, Idempotent, Advanced)
-- Run this entire file in one shot in Supabase SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE everywhere.
-- ==============================================================================


-- ==============================================================================
-- SECTION 1: TABLES
-- ==============================================================================

-- Profiles (1-to-1 with auth.users)
create table if not exists profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  name        text        not null default 'Athlete',
  email       text        not null default '',
  avatar_url  text,
  xp_total    integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Exercises master list (seeded once)
create table if not exists exercises (
  id              serial      primary key,
  name            text        not null,
  muscle_group    text        not null,
  difficulty      text        not null default 'beginner',
  image_url       text,
  instructions    text,
  common_mistakes text,
  created_at      timestamptz not null default now()
);

-- Workout templates (one per day: mon-sat, no thursday)
create table if not exists workout_templates (
  id      serial primary key,
  day     text   not null unique,  -- 'monday', 'tuesday', etc.
  name    text   not null,
  focus   text   not null
);

-- Exercises within each day's template
create table if not exists workout_template_exercises (
  id             serial  primary key,
  template_id    integer not null references workout_templates(id) on delete cascade,
  exercise_id    integer not null references exercises(id) on delete cascade,
  sets           integer not null,
  reps           text    not null,  -- '10-12', '30 sec', etc.
  exercise_order integer not null
);

-- Each completed workout session
create table if not exists workout_sessions (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references profiles(id) on delete cascade,
  date             date        not null default current_date,
  day              text        not null,
  start_time       timestamptz,
  end_time         timestamptz,
  duration_minutes integer,
  completion_score integer     not null default 0 check (completion_score between 0 and 100),
  notes            text,
  created_at       timestamptz not null default now()
);

-- Every set completed within a session
create table if not exists workout_sets (
  id          uuid        primary key default gen_random_uuid(),
  session_id  uuid        not null references workout_sessions(id) on delete cascade,
  exercise_id integer     references exercises(id) on delete set null,
  set_number  integer     not null,
  target_reps text        not null default '0',
  actual_reps integer     not null default 0,
  completed   boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- Achievement definitions (static, seeded once)
create table if not exists achievements (
  id              serial  primary key,
  name            text    not null unique,
  description     text    not null,
  condition_type  text    not null,  -- 'streak','total_sets','total_workouts','perfect_week'
  condition_value integer not null,
  icon            text    not null default '🏆'
);

-- Achievements unlocked per user
create table if not exists user_achievements (
  id             serial      primary key,
  user_id        uuid        not null references profiles(id) on delete cascade,
  achievement_id integer     not null references achievements(id) on delete cascade,
  unlocked_at    timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- Personal records per user per exercise
create table if not exists personal_records (
  id                  serial      primary key,
  user_id             uuid        not null references profiles(id) on delete cascade,
  exercise_id         integer     not null references exercises(id) on delete cascade,
  max_weight          numeric     not null default 0,
  max_reps            integer     not null default 0,
  longest_hold_seconds integer     not null default 0,
  estimated_1rm       numeric     not null default 0,
  achieved_at         timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (user_id, exercise_id)
);

-- Streak tracking (one row per user)
create table if not exists streaks (
  id                 serial      primary key,
  user_id            uuid        not null unique references profiles(id) on delete cascade,
  current_streak     integer     not null default 0,
  best_streak        integer     not null default 0,
  last_workout_date  date,
  updated_at         timestamptz not null default now()
);


-- ==============================================================================
-- SECTION 1B: SAFE COLUMN MIGRATIONS
-- Adds any new columns to existing tables without breaking a re-run.
-- This is critical for tables that already exist in the database.
-- ==============================================================================

-- profiles: add columns that may not exist yet
alter table profiles add column if not exists xp_total    integer     not null default 0;
alter table profiles add column if not exists updated_at  timestamptz not null default now();
alter table profiles add column if not exists avatar_url  text;
alter table profiles add column if not exists role        text        not null default 'user';

-- workout_sessions: add notes column if missing
alter table workout_sessions add column if not exists notes text;

-- workout_sets: ensure actual_reps has correct default
alter table workout_sets alter column actual_reps set default 0;

-- personal_records: migrate to the current production shape used by the app
alter table personal_records add column if not exists max_weight numeric not null default 0;
alter table personal_records add column if not exists max_reps integer not null default 0;
alter table personal_records add column if not exists longest_hold_seconds integer not null default 0;
alter table personal_records add column if not exists estimated_1rm numeric not null default 0;
alter table personal_records add column if not exists achieved_at timestamptz not null default now();
alter table personal_records add column if not exists updated_at timestamptz not null default now();

-- Body metrics tracking (used by the production UI)
create table if not exists body_metrics (
  id                  serial      primary key,
  user_id             uuid        not null references profiles(id) on delete cascade,
  weight_kg           numeric     not null,
  body_fat_percentage numeric,
  measured_at         timestamptz not null default now(),
  notes               text,
  created_at          timestamptz not null default now()
);

alter table body_metrics add column if not exists notes text;
alter table body_metrics add column if not exists created_at timestamptz not null default now();

-- Current workout storage used by the app (v5)
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

create table if not exists workout_exercises_v5 (
  id           uuid    primary key default gen_random_uuid(),
  workout_id   uuid    not null references workouts_v5(id) on delete cascade,
  exercise_id  integer not null references exercises(id) on delete cascade,
  order_index  integer not null,
  sets_skipped integer not null default 0
);

create table if not exists workout_sets_v5 (
  id                  uuid    primary key default gen_random_uuid(),
  workout_exercise_id uuid    not null references workout_exercises_v5(id) on delete cascade,
  actual_reps         integer not null,
  weight_kg           numeric not null default 0,
  unit                text    not null default 'kg',
  completed           boolean not null default false
);

-- Admin and System Tables
create table if not exists app_settings (
  id          serial      primary key,
  key         text        not null unique,
  value       jsonb       not null,
  updated_at  timestamptz not null default now()
);

create table if not exists admin_logs (
  id          serial      primary key,
  admin_id    uuid        not null references profiles(id) on delete cascade,
  action      text        not null,
  details     jsonb,
  created_at  timestamptz not null default now()
);

-- Ensure unique constraints exist for ON CONFLICT clauses (fixes ERROR 42P10)
alter table streaks drop constraint if exists streaks_user_id_key;
alter table streaks add constraint streaks_user_id_key unique (user_id);

alter table achievements drop constraint if exists achievements_name_key;
alter table achievements add constraint achievements_name_key unique (name);

alter table user_achievements drop constraint if exists user_achievements_user_id_achievement_id_key;
alter table user_achievements add constraint user_achievements_user_id_achievement_id_key unique (user_id, achievement_id);

alter table personal_records drop constraint if exists personal_records_user_id_exercise_id_key;
alter table personal_records add constraint personal_records_user_id_exercise_id_key unique (user_id, exercise_id);


-- ==============================================================================
-- SECTION 2: PERFORMANCE INDEXES
-- ==============================================================================

create index if not exists idx_profiles_id
  on profiles(id);


create index if not exists idx_workout_sessions_user_id
  on workout_sessions(user_id);

create index if not exists idx_workout_sessions_date
  on workout_sessions(date desc);

create index if not exists idx_workout_sessions_user_date
  on workout_sessions(user_id, date desc);

create index if not exists idx_workout_sets_session_id
  on workout_sets(session_id);

create index if not exists idx_workout_sets_exercise_id
  on workout_sets(exercise_id);

create index if not exists idx_workout_sets_completed
  on workout_sets(session_id, completed) where completed = true;

create index if not exists idx_streaks_user_id
  on streaks(user_id);

create index if not exists idx_streaks_last_workout
  on streaks(last_workout_date desc);

create index if not exists idx_user_achievements_user_id
  on user_achievements(user_id);

create index if not exists idx_user_achievements_achievement_id
  on user_achievements(achievement_id);

create index if not exists idx_personal_records_user_id
  on personal_records(user_id);

create index if not exists idx_personal_records_exercise_id
  on personal_records(exercise_id);

create index if not exists idx_body_metrics_user_id
  on body_metrics(user_id, measured_at desc);

create index if not exists idx_workouts_v5_profile_id
  on workouts_v5(profile_id);

create index if not exists idx_workouts_v5_start_time
  on workouts_v5(start_time desc);

create index if not exists idx_workout_exercises_v5_workout_id
  on workout_exercises_v5(workout_id);

create index if not exists idx_workout_exercises_v5_exercise_id
  on workout_exercises_v5(exercise_id);

create index if not exists idx_workout_sets_v5_workout_exercise_id
  on workout_sets_v5(workout_exercise_id);

create index if not exists idx_workout_sets_v5_completed
  on workout_sets_v5(workout_exercise_id, completed) where completed = true;


-- ==============================================================================
-- SECTION 3: ROW LEVEL SECURITY
-- ==============================================================================

alter table profiles           enable row level security;
alter table workout_sessions   enable row level security;
alter table workout_sets       enable row level security;
alter table user_achievements  enable row level security;
alter table personal_records   enable row level security;
alter table streaks            enable row level security;
alter table body_metrics       enable row level security;
alter table workouts_v5        enable row level security;
alter table workout_exercises_v5 enable row level security;
alter table workout_sets_v5    enable row level security;
alter table app_settings       enable row level security;
alter table admin_logs         enable row level security;


-- ==============================================================================
-- SECTION 4: RLS POLICIES (idempotent via DROP + CREATE)
-- ==============================================================================

-- profiles
drop policy if exists "profiles_select_own"  on profiles;
drop policy if exists "profiles_insert_own"  on profiles;
drop policy if exists "profiles_update_own"  on profiles;
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- workout_sessions
drop policy if exists "sessions_all_own" on workout_sessions;
create policy "sessions_all_own" on workout_sessions for all using (auth.uid() = user_id);

-- workout_sets (access via parent session)
drop policy if exists "sets_all_own" on workout_sets;
create policy "sets_all_own" on workout_sets for all using (
  auth.uid() = (select user_id from workout_sessions where id = session_id limit 1)
);

-- user_achievements
drop policy if exists "achievements_all_own" on user_achievements;
create policy "achievements_all_own" on user_achievements for all using (auth.uid() = user_id);

-- personal_records
drop policy if exists "records_all_own" on personal_records;
create policy "records_all_own" on personal_records for all using (auth.uid() = user_id);

-- streaks
drop policy if exists "streaks_all_own" on streaks;
create policy "streaks_all_own" on streaks for all using (auth.uid() = user_id);

-- body metrics
drop policy if exists "body_metrics_all_own" on body_metrics;
create policy "body_metrics_all_own" on body_metrics for all using (auth.uid() = user_id);

-- current v5 workout tables used by the app
drop policy if exists "workouts_v5_all_own" on workouts_v5;
create policy "workouts_v5_all_own" on workouts_v5 for all using (profile_id = auth.uid());

drop policy if exists "workout_exercises_v5_all_own" on workout_exercises_v5;
create policy "workout_exercises_v5_all_own" on workout_exercises_v5 for all using (
  workout_id in (select id from workouts_v5 where profile_id = auth.uid())
);

drop policy if exists "workout_sets_v5_all_own" on workout_sets_v5;
create policy "workout_sets_v5_all_own" on workout_sets_v5 for all using (
  workout_exercise_id in (
    select id from workout_exercises_v5 where workout_id in (
      select id from workouts_v5 where profile_id = auth.uid()
    )
  )
);

-- exercises & achievements are public reads, admin writes
alter table exercises    enable row level security;
alter table achievements enable row level security;
drop policy if exists "exercises_public_read"    on exercises;
drop policy if exists "achievements_public_read" on achievements;
drop policy if exists "exercises_admin_all"      on exercises;
drop policy if exists "achievements_admin_all"   on achievements;

create policy "exercises_public_read"    on exercises    for select using (true);
create policy "achievements_public_read" on achievements for select using (true);

create policy "exercises_admin_all" on exercises for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);
create policy "achievements_admin_all" on achievements for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- app_settings (public read, admin write)
drop policy if exists "settings_public_read" on app_settings;
drop policy if exists "settings_admin_all" on app_settings;
create policy "settings_public_read" on app_settings for select using (true);
create policy "settings_admin_all" on app_settings for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- admin_logs (admin read/write)
drop policy if exists "admin_logs_admin_all" on admin_logs;
create policy "admin_logs_admin_all" on admin_logs for all using (
  (select role from profiles where id = auth.uid()) = 'admin'
);


-- ============================================================================== 
-- SECTION 5B: CURRENT ANALYTICS VIEW FOR V5 WORKOUTS
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

grant select on mv_weekly_volume_v5 to authenticated;
grant select on mv_weekly_volume_v5 to anon;


-- ==============================================================================
-- SECTION 5: UTILITY FUNCTIONS
-- ==============================================================================

-- Securely increment XP for the currently authenticated user only
create or replace function increment_xp(amount integer)
returns void
language sql
security definer
set search_path = public
as $$
  update profiles
     set xp_total   = xp_total + amount,
         updated_at = now()
   where id = auth.uid();
$$;

-- Update the profiles.updated_at column automatically on every row change
create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at
  before update on profiles
  for each row
  execute function touch_updated_at();

drop trigger if exists trg_streaks_updated_at on streaks;
create trigger trg_streaks_updated_at
  before update on streaks
  for each row
  execute function touch_updated_at();


-- ==============================================================================
-- SECTION 6: LIVE COMPLETION SCORE TRIGGER
-- Automatically recomputes workout_sessions.completion_score whenever
-- a set is inserted or updated — no manual calculation needed from the app.
-- ==============================================================================

create or replace function recompute_completion_score()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_sets integer;
  v_done_sets  integer;
  v_score      integer;
begin
  select count(*)
    into v_total_sets
    from workout_sets
   where session_id = new.session_id;

  select count(*)
    into v_done_sets
    from workout_sets
   where session_id = new.session_id
     and completed  = true;

  if v_total_sets > 0 then
    v_score := round((v_done_sets::numeric / v_total_sets) * 100);
  else
    v_score := 0;
  end if;

  update workout_sessions
     set completion_score = v_score
   where id = new.session_id;

  return new;
end;
$$;

drop trigger if exists trg_recompute_score on workout_sets;
create trigger trg_recompute_score
  after insert or update of completed on workout_sets
  for each row
  execute function recompute_completion_score();


-- ==============================================================================
-- SECTION 7: STREAK ACHIEVEMENT TRIGGER
-- Fires after every streak update to check and award streak-based achievements.
-- ==============================================================================

create or replace function check_streak_achievements()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rec achievements%rowtype;
begin
  -- Loop over all streak-type achievements and award any that qualify
  for rec in
    select * from achievements
     where condition_type = 'streak'
       and condition_value <= new.current_streak
  loop
    insert into user_achievements (user_id, achievement_id)
    values (new.user_id, rec.id)
    on conflict (user_id, achievement_id) do nothing;
  end loop;

  return new;
end;
$$;

drop trigger if exists trg_streak_achievements on streaks;
create trigger trg_streak_achievements
  after update of current_streak on streaks
  for each row
  when (new.current_streak > old.current_streak)
  execute function check_streak_achievements();


-- ==============================================================================
-- SECTION 8: SIGNUP TRIGGER
-- Automatically creates a profile + streak row for every new Supabase auth user.
-- This makes the foreign key constraint on workout_sessions bullet-proof.
-- ==============================================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_raw_name       text;
  v_formatted_name text;
  v_avatar_url     text;
begin
  -- Try to get name from Google Auth metadata first
  v_formatted_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name');
  v_avatar_url     := coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture');

  -- Fallback to deriving from email if no name provided
  if v_formatted_name is null or v_formatted_name = '' then
    v_raw_name       := split_part(new.email, '@', 1);
    v_formatted_name := upper(left(v_raw_name, 1)) || lower(substring(v_raw_name from 2));
  end if;

  insert into public.profiles (id, email, name, avatar_url, xp_total)
  values (new.id, new.email, v_formatted_name, v_avatar_url, 0)
  on conflict (id) do update
  set name = excluded.name,
      avatar_url = excluded.avatar_url;

  insert into public.streaks (user_id, current_streak, best_streak)
  values (new.id, 0, 0)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();


-- ==============================================================================
-- SECTION 9: ANALYTICS VIEW
-- A fast, security-aware view for dashboard charts and heatmaps.
-- ==============================================================================

drop view if exists workout_daily_summary cascade;
create or replace view workout_daily_summary
  with (security_invoker = true)
as
select
  ws.user_id,
  ws.date,
  ws.day,
  ws.duration_minutes,
  ws.completion_score,
  count(wset.id)                               as total_sets,
  count(wset.id) filter (where wset.completed) as completed_sets,
  coalesce(sum(wset.actual_reps), 0)           as total_reps
from workout_sessions ws
left join workout_sets wset on wset.session_id = ws.id
group by
  ws.user_id,
  ws.date,
  ws.day,
  ws.duration_minutes,
  ws.completion_score;

grant select on workout_daily_summary to authenticated;


-- ==============================================================================
-- SECTION 10: ONE-TIME BACKFILL (safe to re-run — uses ON CONFLICT DO NOTHING)
-- Fixes any existing auth users who are missing profile/streak rows.
-- The FOR loop runs over auth.users and inserts missing rows safely.
-- ==============================================================================

do $$
declare
  v_user          record;
  v_raw_name      text;
  v_display_name  text;
begin
  for v_user in select id, email from auth.users loop

    v_raw_name     := split_part(v_user.email, '@', 1);
    v_display_name := upper(left(v_raw_name, 1)) || lower(substring(v_raw_name from 2));

    insert into public.profiles (id, email, name, xp_total)
    values (v_user.id, v_user.email, v_display_name, 0)
    on conflict (id) do nothing;

    insert into public.streaks (user_id, current_streak, best_streak)
    values (v_user.id, 0, 0)
    on conflict (user_id) do nothing;

  end loop;
end;
$$;


-- ==============================================================================
-- SECTION 11: SEED ACHIEVEMENTS (idempotent — uses ON CONFLICT DO NOTHING)
-- ==============================================================================

insert into achievements (name, description, condition_type, condition_value, icon) values
  ('First Step',       'Complete your very first workout.',              'total_workouts', 1,   '👟'),
  ('Getting Started',  'Complete 5 workouts.',                           'total_workouts', 5,   '💪'),
  ('Consistent',       'Complete 10 workouts.',                          'total_workouts', 10,  '📅'),
  ('Dedicated',        'Complete 25 workouts.',                          'total_workouts', 25,  '🎯'),
  ('Centurion',        'Complete 100 workouts.',                         'total_workouts', 100, '🏅'),
  ('Set Starter',      'Complete 50 total sets.',                        'total_sets',     50,  '✅'),
  ('Set Machine',      'Complete 500 total sets.',                       'total_sets',     500, '⚙️'),
  ('Set Legend',       'Complete 2000 total sets.',                      'total_sets',     2000,'🔩'),
  ('3-Day Streak',     'Work out 3 days in a row.',                      'streak',         3,   '🔥'),
  ('Iron Will',        'Maintain a 7-day streak.',                       'streak',         7,   '⚡'),
  ('Two Weeks Strong', 'Maintain a 14-day streak.',                      'streak',         14,  '💎'),
  ('Monthly Beast',    'Maintain a 30-day streak.',                      'streak',         30,  '👑')
on conflict (name) do nothing;


-- ==============================================================================
-- END OF SCHEMA
-- All sections are idempotent and safe to re-run at any time.
-- ==============================================================================
