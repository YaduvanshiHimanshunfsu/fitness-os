-- ==============================================================================
-- FITNESS OS — COMPLETE DATABASE SCHEMA
-- Version: 5.0 (Production-Grade, Idempotent, Advanced)
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
  id                 serial      primary key,
  user_id            uuid        not null references profiles(id) on delete cascade,
  exercise_id        integer     not null references exercises(id) on delete cascade,
  best_reps          integer     not null default 0,
  best_time_seconds  integer     not null default 0,
  lifetime_reps      integer     not null default 0,
  updated_at         timestamptz not null default now(),
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

-- workout_sessions: add notes column if missing
alter table workout_sessions add column if not exists notes text;

-- workout_sets: ensure actual_reps has correct default
alter table workout_sets alter column actual_reps set default 0;

-- Ensure unique constraints exist for ON CONFLICT clauses (fixes ERROR 42P10)
alter table streaks drop constraint if exists streaks_user_id_key;
alter table streaks add constraint streaks_user_id_key unique (user_id);

alter table achievements drop constraint if exists achievements_name_key;
alter table achievements add constraint achievements_name_key unique (name);

alter table user_achievements drop constraint if exists user_achievements_user_id_achievement_id_key;
alter table user_achievements add constraint user_achievements_user_id_achievement_id_key unique (user_id, achievement_id);


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


-- ==============================================================================
-- SECTION 3: ROW LEVEL SECURITY
-- ==============================================================================

alter table profiles           enable row level security;
alter table workout_sessions   enable row level security;
alter table workout_sets       enable row level security;
alter table user_achievements  enable row level security;
alter table personal_records   enable row level security;
alter table streaks            enable row level security;


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

-- exercises & achievements are public reads
alter table exercises    enable row level security;
alter table achievements enable row level security;
drop policy if exists "exercises_public_read"    on exercises;
drop policy if exists "achievements_public_read" on achievements;
create policy "exercises_public_read"    on exercises    for select using (true);
create policy "achievements_public_read" on achievements for select using (true);


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
begin
  -- Derive a display name from the email prefix
  v_raw_name       := split_part(new.email, '@', 1);
  v_formatted_name := upper(left(v_raw_name, 1)) || lower(substring(v_raw_name from 2));

  insert into public.profiles (id, email, name, xp_total)
  values (new.id, new.email, v_formatted_name, 0)
  on conflict (id) do nothing;

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
