-- Profiles (linked to Supabase Auth, max 5 users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- Exercises (~50 rows, seeded once)
create table exercises (
  id serial primary key,
  name text not null,
  muscle_group text not null,
  difficulty text not null default 'beginner',
  image_url text,
  instructions text,
  common_mistakes text
);

-- Workout templates (Mon–Sat, no Thursday)
create table workout_templates (
  id serial primary key,
  day text not null unique, -- 'monday', 'tuesday', etc.
  name text not null,
  focus text not null
);

-- Exercises per day with sets/reps targets
create table workout_template_exercises (
  id serial primary key,
  template_id integer references workout_templates(id),
  exercise_id integer references exercises(id),
  sets integer not null,
  reps text not null, -- '10-12', '30 sec', etc.
  exercise_order integer not null
);

-- Each completed workout
create table workout_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  date date not null default current_date,
  day text not null,
  start_time timestamptz,
  end_time timestamptz,
  duration_minutes integer,
  completion_score integer default 0, -- 0-100 percent
  created_at timestamptz default now()
);

-- Each individual set completed
create table workout_sets (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references workout_sessions(id) on delete cascade,
  exercise_id integer references exercises(id),
  set_number integer not null,
  target_reps text not null,
  actual_reps integer,
  completed boolean default false,
  timestamp timestamptz default now()
);

-- Achievement definitions
create table achievements (
  id serial primary key,
  name text not null,
  description text not null,
  condition_type text not null, -- 'streak', 'total_sets', 'total_workouts', 'perfect_week'
  condition_value integer not null,
  icon text default '🏆'
);

-- User unlocked achievements
create table user_achievements (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  achievement_id integer references achievements(id),
  unlocked_at timestamptz default now(),
  unique(user_id, achievement_id)
);

-- Personal records per user per exercise
create table personal_records (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  exercise_id integer references exercises(id),
  best_reps integer default 0,
  best_time_seconds integer default 0,
  lifetime_reps integer default 0,
  updated_at timestamptz default now(),
  unique(user_id, exercise_id)
);

-- Streak tracking
create table streaks (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade unique,
  current_streak integer default 0,
  best_streak integer default 0,
  last_workout_date date,
  updated_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table workout_sessions enable row level security;
alter table workout_sets enable row level security;
alter table user_achievements enable row level security;
alter table personal_records enable row level security;
alter table streaks enable row level security;

-- RLS Policies (users only see their own data)
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can view own sessions"
  on workout_sessions for all using (auth.uid() = user_id);

create policy "Users can view own sets"
  on workout_sets for all using (
    auth.uid() = (
      select user_id from workout_sessions where id = session_id
    )
  );

create policy "Users can view own achievements"
  on user_achievements for all using (auth.uid() = user_id);

create policy "Users can view own records"
  on personal_records for all using (auth.uid() = user_id);

create policy "Users can view own streak"
  on streaks for all using (auth.uid() = user_id);

-- Exercises and achievements are public read
create policy "Exercises are public"
  on exercises for select using (true);

create policy "Achievements are public"
  on achievements for select using (true);

-- Phase 2 updates
alter table profiles add column if not exists xp_total integer not null default 0;

create or replace function increment_xp(user_id uuid, amount integer)
returns void
language sql
security definer
as $$
  update profiles
  set xp_total = xp_total + amount
  where id = user_id;
$$;

-- Phase 3 updates
-- Materialized view: sets per day per user (speeds up heatmap + chart queries)
create or replace view workout_daily_summary as
select
  ws.user_id,
  wse.date,
  wse.day,
  count(wst.id) filter (where wst.completed) as completed_sets,
  coalesce(sum(wst.actual_reps), 0)          as total_reps,
  wse.duration_minutes
from workout_sessions wse
join profiles ws on ws.id = wse.user_id
left join workout_sets wst on wst.session_id = wse.id
group by ws.user_id, wse.date, wse.day, wse.duration_minutes;

-- RLS on view
grant select on workout_daily_summary to authenticated;

create policy "Users see own summary"
  on workout_daily_summary for select
  using (auth.uid() = user_id);
