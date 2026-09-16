-- ==============================================================================
-- FITNESS OS — COMPLETE DATABASE SCHEMA
-- Version: 7.2 (Production-Grade, Idempotent, Audit-Compliant)
-- Run this entire file in one shot in the Supabase SQL Editor.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / DROP IF EXISTS everywhere.
-- ==============================================================================


-- ==============================================================================
-- SECTION 1: CORE TABLES
-- ==============================================================================

-- Profiles (1-to-1 with auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text        NOT NULL DEFAULT 'Athlete',
  email       text        NOT NULL DEFAULT '',
  avatar_url  text,
  xp_total    integer     NOT NULL DEFAULT 0,
  role        text        NOT NULL DEFAULT 'user',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Safe column additions for profiles (idempotent)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp_total   integer     NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role       text        NOT NULL DEFAULT 'user';

-- Exercises master list (seeded in Section 10)
CREATE TABLE IF NOT EXISTS exercises (
  id              serial      PRIMARY KEY,
  name            text        NOT NULL,
  muscle_group    text        NOT NULL,
  difficulty      text        NOT NULL DEFAULT 'beginner',
  image_url       text,
  instructions    text,
  common_mistakes text,
  is_deleted      boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Workout templates (one per day)
CREATE TABLE IF NOT EXISTS workout_templates (
  id    serial PRIMARY KEY,
  day   text   NOT NULL UNIQUE,  -- 'monday', 'tuesday', etc.
  name  text   NOT NULL,
  focus text   NOT NULL
);

-- Exercises within each day's template
CREATE TABLE IF NOT EXISTS workout_template_exercises (
  id             serial  PRIMARY KEY,
  template_id    integer NOT NULL REFERENCES workout_templates(id)  ON DELETE CASCADE,
  exercise_id    integer NOT NULL REFERENCES exercises(id)           ON DELETE CASCADE,
  sets           integer NOT NULL,
  reps           text    NOT NULL,   -- '10-12', '30 sec', etc.
  exercise_order integer NOT NULL
);

-- Achievement definitions (static, seeded in Section 11)
CREATE TABLE IF NOT EXISTS achievements (
  id              serial  PRIMARY KEY,
  name            text    NOT NULL UNIQUE,
  description     text    NOT NULL,
  condition_type  text    NOT NULL,
  condition_value integer NOT NULL,
  icon            text    NOT NULL DEFAULT '🏆'
);

-- Achievements unlocked per user
CREATE TABLE IF NOT EXISTS user_achievements (
  id             serial      PRIMARY KEY,
  user_id        uuid        NOT NULL REFERENCES profiles(id)      ON DELETE CASCADE,
  achievement_id integer     NOT NULL REFERENCES achievements(id)  ON DELETE CASCADE,
  unlocked_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);

-- ==============================================================================
-- SECTION 2: MARTIAL ARTS TRAINING TABLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS martial_arts_exercises (
  id          serial      PRIMARY KEY,
  name        text        NOT NULL,
  instruction text,
  comment     text,
  image_url   text,
  is_deleted  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS martial_arts_templates (
  id          serial PRIMARY KEY,
  day         text   NOT NULL UNIQUE,
  title       text   NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS martial_arts_template_exercises (
  id             serial  PRIMARY KEY,
  template_id    integer NOT NULL REFERENCES martial_arts_templates(id)  ON DELETE CASCADE,
  exercise_id    integer NOT NULL REFERENCES martial_arts_exercises(id)  ON DELETE CASCADE,
  sets           integer NOT NULL,
  reps           text    NOT NULL,
  exercise_order integer NOT NULL
);

-- ==============================================================================
-- SECTION 3: MUSCLE FOCUS TRAINING TABLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS muscle_focus_exercises (
  id          serial      PRIMARY KEY,
  name        text        NOT NULL,
  instruction text,
  comment     text,
  image_url   text,
  is_deleted  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS muscle_focus_templates (
  id          serial PRIMARY KEY,
  category    text   NOT NULL UNIQUE,   -- 'chest_focus', 'arms_focus', etc.
  title       text   NOT NULL,
  description text
);

CREATE TABLE IF NOT EXISTS muscle_focus_template_exercises (
  id             serial  PRIMARY KEY,
  template_id    integer NOT NULL REFERENCES muscle_focus_templates(id)  ON DELETE CASCADE,
  exercise_id    integer NOT NULL REFERENCES muscle_focus_exercises(id)  ON DELETE CASCADE,
  sets           integer NOT NULL,
  reps           text    NOT NULL,
  exercise_order integer NOT NULL
);

-- ==============================================================================
-- SECTION 4: AUXILIARY ROUTINES (Warmup, Cooldown, Posture, Knockknee)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS auxiliary_routines (
  id        serial PRIMARY KEY,
  category  text   NOT NULL UNIQUE,  -- 'warmup', 'cooldown', 'posture', 'knockknee'
  image_url text
);

CREATE TABLE IF NOT EXISTS auxiliary_routine_exercises (
  id               serial      PRIMARY KEY,
  routine_id       integer     NOT NULL REFERENCES auxiliary_routines(id) ON DELETE CASCADE,
  name             text        NOT NULL,
  duration_seconds integer,
  reps             text,
  sets             integer,
  exercise_order   integer     NOT NULL,
  is_deleted       boolean     NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- SECTION 5: USER DATA TABLES
-- ==============================================================================

-- Personal records per user per exercise
CREATE TABLE IF NOT EXISTS personal_records (
  id                   serial      PRIMARY KEY,
  user_id              uuid        NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  exercise_id          integer     NOT NULL REFERENCES exercises(id)  ON DELETE CASCADE,
  max_weight           numeric     NOT NULL DEFAULT 0,
  max_reps             integer     NOT NULL DEFAULT 0,
  longest_hold_seconds integer     NOT NULL DEFAULT 0,
  estimated_1rm        numeric     NOT NULL DEFAULT 0,
  achieved_at          timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);

-- Safe column migrations for personal_records
ALTER TABLE personal_records ADD COLUMN IF NOT EXISTS max_weight           numeric     NOT NULL DEFAULT 0;
ALTER TABLE personal_records ADD COLUMN IF NOT EXISTS max_reps             integer     NOT NULL DEFAULT 0;
ALTER TABLE personal_records ADD COLUMN IF NOT EXISTS longest_hold_seconds integer     NOT NULL DEFAULT 0;
ALTER TABLE personal_records ADD COLUMN IF NOT EXISTS estimated_1rm        numeric     NOT NULL DEFAULT 0;
ALTER TABLE personal_records ADD COLUMN IF NOT EXISTS achieved_at          timestamptz NOT NULL DEFAULT now();
ALTER TABLE personal_records ADD COLUMN IF NOT EXISTS updated_at           timestamptz NOT NULL DEFAULT now();

-- Streak tracking (one row per user)
CREATE TABLE IF NOT EXISTS streaks (
  id                serial      PRIMARY KEY,
  user_id           uuid        NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak    integer     NOT NULL DEFAULT 0,
  best_streak       integer     NOT NULL DEFAULT 0,
  last_workout_date date,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- Body metrics tracking
CREATE TABLE IF NOT EXISTS body_metrics (
  id                  serial      PRIMARY KEY,
  user_id             uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg           numeric     NOT NULL,
  body_fat_percentage numeric,
  measured_at         timestamptz NOT NULL DEFAULT now(),
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE body_metrics ADD COLUMN IF NOT EXISTS notes      text;
ALTER TABLE body_metrics ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- Current workout storage (v5)
CREATE TABLE IF NOT EXISTS workouts_v5 (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id         uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name               text        NOT NULL,
  start_time         timestamptz NOT NULL,
  end_time           timestamptz NOT NULL,
  xp_earned          integer     NOT NULL DEFAULT 0,
  sets_skipped       integer     NOT NULL DEFAULT 0,
  exercises_skipped  integer     NOT NULL DEFAULT 0,
  estimated_calories integer     NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workout_exercises_v5 (
  id                       uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id               uuid    NOT NULL REFERENCES workouts_v5(id)              ON DELETE CASCADE,
  exercise_id              integer REFERENCES exercises(id)                          ON DELETE SET NULL,
  martial_arts_exercise_id integer REFERENCES martial_arts_exercises(id)            ON DELETE SET NULL,
  muscle_focus_exercise_id integer REFERENCES muscle_focus_exercises(id)            ON DELETE SET NULL,
  exercise_name            text,
  order_index              integer NOT NULL,
  sets_skipped             integer NOT NULL DEFAULT 0
);

-- Safe column migrations for workout_exercises_v5
ALTER TABLE workout_exercises_v5 ADD COLUMN IF NOT EXISTS exercise_name            text;
ALTER TABLE workout_exercises_v5 ADD COLUMN IF NOT EXISTS martial_arts_exercise_id integer REFERENCES martial_arts_exercises(id) ON DELETE SET NULL;
ALTER TABLE workout_exercises_v5 ADD COLUMN IF NOT EXISTS muscle_focus_exercise_id integer REFERENCES muscle_focus_exercises(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS workout_sets_v5 (
  id                  uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id uuid    NOT NULL REFERENCES workout_exercises_v5(id) ON DELETE CASCADE,
  actual_reps         integer NOT NULL,
  weight_kg           numeric NOT NULL DEFAULT 0,
  unit                text    NOT NULL DEFAULT 'kg',
  completed           boolean NOT NULL DEFAULT false
);

-- ==============================================================================
-- SECTION 6: ACTIVITY FEED (Community module)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS activity_feed (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_name   text        NOT NULL DEFAULT 'Athlete',
  action_type text        NOT NULL DEFAULT 'workout_completed',
  data        jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- SECTION 7: ADMIN + SYSTEM TABLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS app_settings (
  id         serial      PRIMARY KEY,
  key        text        NOT NULL UNIQUE,
  value      jsonb       NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_logs (
  id         serial      PRIMARY KEY,
  admin_id   uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action     text        NOT NULL,
  details    jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);


-- ==============================================================================
-- SECTION 8: UNIQUE CONSTRAINTS (idempotent)
-- ==============================================================================

ALTER TABLE streaks         DROP CONSTRAINT IF EXISTS streaks_user_id_key;
ALTER TABLE streaks         ADD  CONSTRAINT streaks_user_id_key UNIQUE (user_id);

ALTER TABLE achievements    DROP CONSTRAINT IF EXISTS achievements_name_key;
ALTER TABLE achievements    ADD  CONSTRAINT achievements_name_key UNIQUE (name);

ALTER TABLE user_achievements DROP CONSTRAINT IF EXISTS user_achievements_user_id_achievement_id_key;
ALTER TABLE user_achievements ADD  CONSTRAINT user_achievements_user_id_achievement_id_key UNIQUE (user_id, achievement_id);

ALTER TABLE personal_records DROP CONSTRAINT IF EXISTS personal_records_user_id_exercise_id_key;
ALTER TABLE personal_records ADD  CONSTRAINT personal_records_user_id_exercise_id_key UNIQUE (user_id, exercise_id);

-- Enforce valid achievement condition types
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS chk_achievements_condition_type;
ALTER TABLE achievements ADD  CONSTRAINT chk_achievements_condition_type
  CHECK (condition_type IN ('total_workouts', 'total_sets', 'streak', 'level', 'specific_exercise', 'perfect_week'));


-- ==============================================================================
-- SECTION 9: PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_id                      ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_streaks_user_id                  ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_last_workout             ON streaks(last_workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id        ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id         ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_id     ON personal_records(exercise_id);
CREATE INDEX IF NOT EXISTS idx_body_metrics_user_id             ON body_metrics(user_id, measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_v5_profile_id           ON workouts_v5(profile_id);
CREATE INDEX IF NOT EXISTS idx_workouts_v5_start_time           ON workouts_v5(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_v5_workout_id  ON workout_exercises_v5(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_v5_exercise_id ON workout_exercises_v5(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_v5_we_id            ON workout_sets_v5(workout_exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_v5_completed        ON workout_sets_v5(workout_exercise_id, completed) WHERE completed = true;
CREATE INDEX IF NOT EXISTS idx_workout_template_ex_template_id  ON workout_template_exercises(template_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_created       ON activity_feed(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created            ON activity_feed(created_at DESC);


-- ==============================================================================
-- SECTION 10: ROW LEVEL SECURITY
-- ==============================================================================

ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements     ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records      ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_metrics          ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts_v5          ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises_v5  ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets_v5      ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises            ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates    ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE auxiliary_routines         ENABLE ROW LEVEL SECURITY;
ALTER TABLE auxiliary_routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE martial_arts_exercises     ENABLE ROW LEVEL SECURITY;
ALTER TABLE martial_arts_templates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE martial_arts_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_focus_exercises     ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_focus_templates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_focus_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed              ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- SECTION 11: RLS POLICIES (idempotent via DROP + CREATE)
-- ==============================================================================

-- ─── profiles ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- ─── exercises (public read, admin write) ────────────────────────────────────
DROP POLICY IF EXISTS "exercises_public_read" ON exercises;
DROP POLICY IF EXISTS "exercises_admin_all"   ON exercises;
CREATE POLICY "exercises_public_read" ON exercises FOR SELECT USING (true);
CREATE POLICY "exercises_admin_all"   ON exercises FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── workout_templates (public read, admin write) ────────────────────────────
DROP POLICY IF EXISTS "templates_public_read" ON workout_templates;
DROP POLICY IF EXISTS "templates_admin_all"   ON workout_templates;
CREATE POLICY "templates_public_read" ON workout_templates FOR SELECT USING (true);
CREATE POLICY "templates_admin_all"   ON workout_templates FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── workout_template_exercises (public read, admin write) ───────────────────
DROP POLICY IF EXISTS "template_exercises_public_read" ON workout_template_exercises;
DROP POLICY IF EXISTS "template_exercises_admin_all"   ON workout_template_exercises;
CREATE POLICY "template_exercises_public_read" ON workout_template_exercises FOR SELECT USING (true);
CREATE POLICY "template_exercises_admin_all"   ON workout_template_exercises FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── auxiliary_routines (public read, admin write) ───────────────────────────
DROP POLICY IF EXISTS "aux_routines_public_read" ON auxiliary_routines;
DROP POLICY IF EXISTS "aux_routines_admin_all"   ON auxiliary_routines;
CREATE POLICY "aux_routines_public_read" ON auxiliary_routines FOR SELECT USING (true);
CREATE POLICY "aux_routines_admin_all"   ON auxiliary_routines FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── auxiliary_routine_exercises (public read, admin write) ──────────────────
DROP POLICY IF EXISTS "aux_exercises_public_read" ON auxiliary_routine_exercises;
DROP POLICY IF EXISTS "aux_exercises_admin_all"   ON auxiliary_routine_exercises;
CREATE POLICY "aux_exercises_public_read" ON auxiliary_routine_exercises FOR SELECT USING (true);
CREATE POLICY "aux_exercises_admin_all"   ON auxiliary_routine_exercises FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── achievements (public read, admin write) ─────────────────────────────────
DROP POLICY IF EXISTS "achievements_public_read" ON achievements;
DROP POLICY IF EXISTS "achievements_admin_all"   ON achievements;
CREATE POLICY "achievements_public_read" ON achievements FOR SELECT USING (true);
CREATE POLICY "achievements_admin_all"   ON achievements FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── user_achievements ───────────────────────────────────────────────────────
DROP POLICY IF EXISTS "achievements_all_own" ON user_achievements;
CREATE POLICY "achievements_all_own" ON user_achievements FOR ALL USING (auth.uid() = user_id);

-- ─── personal_records ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "records_all_own" ON personal_records;
CREATE POLICY "records_all_own" ON personal_records FOR ALL USING (auth.uid() = user_id);

-- ─── streaks ─────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "streaks_all_own" ON streaks;
CREATE POLICY "streaks_all_own" ON streaks FOR ALL USING (auth.uid() = user_id);

-- ─── body_metrics ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "body_metrics_all_own" ON body_metrics;
CREATE POLICY "body_metrics_all_own" ON body_metrics FOR ALL USING (auth.uid() = user_id);

-- ─── workouts_v5 ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "workouts_v5_all_own" ON workouts_v5;
CREATE POLICY "workouts_v5_all_own" ON workouts_v5 FOR ALL USING (profile_id = auth.uid());

-- ─── workout_exercises_v5 ────────────────────────────────────────────────────
DROP POLICY IF EXISTS "workout_exercises_v5_all_own" ON workout_exercises_v5;
CREATE POLICY "workout_exercises_v5_all_own" ON workout_exercises_v5 FOR ALL USING (
  workout_id IN (SELECT id FROM workouts_v5 WHERE profile_id = auth.uid())
);

-- ─── workout_sets_v5 ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "workout_sets_v5_all_own" ON workout_sets_v5;
CREATE POLICY "workout_sets_v5_all_own" ON workout_sets_v5 FOR ALL USING (
  workout_exercise_id IN (
    SELECT id FROM workout_exercises_v5
    WHERE workout_id IN (SELECT id FROM workouts_v5 WHERE profile_id = auth.uid())
  )
);

-- ─── app_settings (public read, admin write) ─────────────────────────────────
DROP POLICY IF EXISTS "settings_public_read" ON app_settings;
DROP POLICY IF EXISTS "settings_admin_all"   ON app_settings;
CREATE POLICY "settings_public_read" ON app_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_all"   ON app_settings FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── admin_logs (admin only) ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "admin_logs_admin_all" ON admin_logs;
CREATE POLICY "admin_logs_admin_all" ON admin_logs FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── martial_arts tables (public read, admin write) ──────────────────────────
DROP POLICY IF EXISTS "ma_ex_public_read"        ON martial_arts_exercises;
DROP POLICY IF EXISTS "ma_ex_admin_all"          ON martial_arts_exercises;
DROP POLICY IF EXISTS "ma_tmpl_public_read"      ON martial_arts_templates;
DROP POLICY IF EXISTS "ma_tmpl_admin_all"        ON martial_arts_templates;
DROP POLICY IF EXISTS "ma_tmpl_ex_public_read"   ON martial_arts_template_exercises;
DROP POLICY IF EXISTS "ma_tmpl_ex_admin_all"     ON martial_arts_template_exercises;

CREATE POLICY "ma_ex_public_read" ON martial_arts_exercises FOR SELECT USING (true);
CREATE POLICY "ma_ex_admin_all"   ON martial_arts_exercises FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "ma_tmpl_public_read" ON martial_arts_templates FOR SELECT USING (true);
CREATE POLICY "ma_tmpl_admin_all"   ON martial_arts_templates FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "ma_tmpl_ex_public_read" ON martial_arts_template_exercises FOR SELECT USING (true);
CREATE POLICY "ma_tmpl_ex_admin_all"   ON martial_arts_template_exercises FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── muscle_focus tables (public read, admin write) ──────────────────────────
DROP POLICY IF EXISTS "mf_ex_public_read"        ON muscle_focus_exercises;
DROP POLICY IF EXISTS "mf_ex_admin_all"          ON muscle_focus_exercises;
DROP POLICY IF EXISTS "mf_tmpl_public_read"      ON muscle_focus_templates;
DROP POLICY IF EXISTS "mf_tmpl_admin_all"        ON muscle_focus_templates;
DROP POLICY IF EXISTS "mf_tmpl_ex_public_read"   ON muscle_focus_template_exercises;
DROP POLICY IF EXISTS "mf_tmpl_ex_admin_all"     ON muscle_focus_template_exercises;

CREATE POLICY "mf_ex_public_read" ON muscle_focus_exercises FOR SELECT USING (true);
CREATE POLICY "mf_ex_admin_all"   ON muscle_focus_exercises FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "mf_tmpl_public_read" ON muscle_focus_templates FOR SELECT USING (true);
CREATE POLICY "mf_tmpl_admin_all"   ON muscle_focus_templates FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY "mf_tmpl_ex_public_read" ON muscle_focus_template_exercises FOR SELECT USING (true);
CREATE POLICY "mf_tmpl_ex_admin_all"   ON muscle_focus_template_exercises FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- ─── activity_feed (public read, own insert/delete) ──────────────────────────
DROP POLICY IF EXISTS "feed_public_read" ON activity_feed;
DROP POLICY IF EXISTS "feed_insert_own"  ON activity_feed;
DROP POLICY IF EXISTS "feed_delete_own"  ON activity_feed;
CREATE POLICY "feed_public_read" ON activity_feed FOR SELECT USING (true);
CREATE POLICY "feed_insert_own"  ON activity_feed FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feed_delete_own"  ON activity_feed FOR DELETE USING (auth.uid() = user_id);


-- ==============================================================================
-- SECTION 12: ANALYTICS VIEWS
-- ==============================================================================

-- Daily workout summary view (replaces materialized view — always fresh)
DROP VIEW IF EXISTS workout_daily_summary CASCADE;
CREATE OR REPLACE VIEW workout_daily_summary
  WITH (security_invoker = true)
AS
SELECT
  w.profile_id                                                           AS user_id,
  w.start_time::date                                                     AS date,
  to_char(w.start_time, 'Day')                                           AS day,
  EXTRACT(EPOCH FROM (w.end_time - w.start_time)) / 60                  AS duration_minutes,
  CASE
    WHEN (COUNT(ws.id) + w.sets_skipped) > 0
    THEN ROUND(
      (COUNT(ws.id) FILTER (WHERE ws.completed = true)::numeric
       / (COUNT(ws.id) + w.sets_skipped)) * 100
    )
    ELSE 0
  END                                                                     AS completion_score,
  COUNT(ws.id) + w.sets_skipped                                          AS total_sets,
  COUNT(ws.id) FILTER (WHERE ws.completed)                               AS completed_sets,
  COALESCE(SUM(ws.actual_reps), 0)                                       AS total_reps
FROM workouts_v5 w
LEFT JOIN workout_exercises_v5 we ON we.workout_id = w.id
LEFT JOIN workout_sets_v5 ws      ON ws.workout_exercise_id = we.id
GROUP BY w.id, w.profile_id, w.start_time, w.end_time, w.sets_skipped;

GRANT SELECT ON workout_daily_summary TO authenticated;

-- Weekly volume view (replaces materialized view — always fresh, always correct)
DROP MATERIALIZED VIEW IF EXISTS mv_weekly_volume_v5;
CREATE OR REPLACE VIEW mv_weekly_volume_v5
  WITH (security_invoker = true)
AS
SELECT
  w.profile_id,
  date_trunc('week', w.start_time)                              AS week_start,
  COUNT(ws.id) FILTER (WHERE ws.completed = true)              AS sets_completed
FROM workouts_v5 w
JOIN workout_exercises_v5 we ON w.id = we.workout_id
JOIN workout_sets_v5 ws      ON we.id = ws.workout_exercise_id
GROUP BY 1, 2;

GRANT SELECT ON mv_weekly_volume_v5 TO authenticated;
GRANT SELECT ON mv_weekly_volume_v5 TO anon;

-- Personal records compatibility view (for chat context and any legacy queries)
-- Exposes `max_weight_kg` alias so old queries don't break
DROP VIEW IF EXISTS records CASCADE;
CREATE OR REPLACE VIEW records
  WITH (security_invoker = true)
AS
SELECT
  id,
  user_id,
  exercise_id,
  max_reps,
  max_weight        AS max_weight_kg,
  'kg'::text        AS unit,
  estimated_1rm,
  achieved_at,
  updated_at
FROM personal_records;

GRANT SELECT ON records TO authenticated;


-- ==============================================================================
-- SECTION 13: UTILITY FUNCTIONS
-- ==============================================================================

-- Securely increment XP for the currently authenticated user
CREATE OR REPLACE FUNCTION increment_xp(amount integer)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE profiles
     SET xp_total   = xp_total + amount,
         updated_at = now()
   WHERE id = auth.uid();
$$;

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Reset exercises ID sequence after explicit ID inserts (prevents future conflicts)
CREATE OR REPLACE FUNCTION reset_exercises_sequence()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT setval('exercises_id_seq', (SELECT COALESCE(MAX(id), 0) FROM exercises));
$$;

-- Trigger: auto-touch updated_at on profiles
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Trigger: auto-touch updated_at on streaks
DROP TRIGGER IF EXISTS trg_streaks_updated_at ON streaks;
CREATE TRIGGER trg_streaks_updated_at
  BEFORE UPDATE ON streaks
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Remove obsolete v4 triggers/functions
DROP TRIGGER  IF EXISTS trg_recompute_score    ON workout_sets;
DROP FUNCTION IF EXISTS recompute_completion_score();


-- ==============================================================================
-- SECTION 14: STREAK ACHIEVEMENT TRIGGER
-- Awards streak-based achievements automatically on every streak update.
-- ==============================================================================

CREATE OR REPLACE FUNCTION check_streak_achievements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec achievements%ROWTYPE;
BEGIN
  -- Only fire when streak actually increased
  FOR rec IN
    SELECT * FROM achievements
     WHERE condition_type = 'streak'
       AND condition_value <= NEW.current_streak
  LOOP
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (NEW.user_id, rec.id)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_streak_achievements ON streaks;
CREATE TRIGGER trg_streak_achievements
  AFTER UPDATE OF current_streak ON streaks
  FOR EACH ROW
  WHEN (NEW.current_streak > OLD.current_streak)
  EXECUTE FUNCTION check_streak_achievements();


-- ==============================================================================
-- SECTION 15: WORKOUT COMPLETION ACHIEVEMENT TRIGGER
-- Awards total_workouts and total_sets achievements after each workout save.
-- ==============================================================================

CREATE OR REPLACE FUNCTION check_workout_achievements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_workouts integer;
  v_total_sets     integer;
  rec              achievements%ROWTYPE;
BEGIN
  -- Count total completed workouts for this user
  SELECT COUNT(*) INTO v_total_workouts
    FROM workouts_v5
   WHERE profile_id = NEW.profile_id;

  -- Count total completed sets for this user
  SELECT COUNT(*) INTO v_total_sets
    FROM workout_sets_v5 ws
    JOIN workout_exercises_v5 we ON ws.workout_exercise_id = we.id
    JOIN workouts_v5 w           ON we.workout_id = w.id
   WHERE w.profile_id = NEW.profile_id
     AND ws.completed = true;

  -- Award total_workouts achievements
  FOR rec IN
    SELECT * FROM achievements
     WHERE condition_type = 'total_workouts'
       AND condition_value <= v_total_workouts
  LOOP
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (NEW.profile_id, rec.id)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END LOOP;

  -- Award total_sets achievements
  FOR rec IN
    SELECT * FROM achievements
     WHERE condition_type = 'total_sets'
       AND condition_value <= v_total_sets
  LOOP
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (NEW.profile_id, rec.id)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_workout_achievements ON workouts_v5;
CREATE TRIGGER trg_workout_achievements
  AFTER INSERT ON workouts_v5
  FOR EACH ROW
  EXECUTE FUNCTION check_workout_achievements();


-- ==============================================================================
-- SECTION 16: ROLE AUDIT TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION audit_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO admin_logs (admin_id, action, details)
    VALUES (
      NEW.id,
      'role_changed',
      jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_role_change ON profiles;
CREATE TRIGGER trg_audit_role_change
  AFTER UPDATE OF role ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION audit_role_change();


-- ==============================================================================
-- SECTION 17: SIGNUP TRIGGER
-- Auto-creates profile + streak row for every new Supabase auth user.
-- ==============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_raw_name       text;
  v_formatted_name text;
  v_avatar_url     text;
BEGIN
  -- Try Google OAuth metadata first
  v_formatted_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name'
  );
  v_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  -- Fallback: derive name from email prefix
  IF v_formatted_name IS NULL OR v_formatted_name = '' THEN
    v_raw_name       := split_part(NEW.email, '@', 1);
    v_formatted_name := upper(left(v_raw_name, 1)) || lower(substring(v_raw_name FROM 2));
  END IF;

  INSERT INTO public.profiles (id, email, name, avatar_url, xp_total)
  VALUES (NEW.id, NEW.email, v_formatted_name, v_avatar_url, 0)
  ON CONFLICT (id) DO UPDATE
    SET name       = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url;

  INSERT INTO public.streaks (user_id, current_streak, best_streak)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();


-- ==============================================================================
-- SECTION 18: ONE-TIME BACKFILL
-- Fixes existing auth users who are missing profile/streak rows.
-- Safe to re-run: uses ON CONFLICT DO NOTHING.
-- ==============================================================================

DO $$
DECLARE
  v_user         record;
  v_raw_name     text;
  v_display_name text;
BEGIN
  FOR v_user IN SELECT id, email FROM auth.users LOOP
    v_raw_name     := split_part(v_user.email, '@', 1);
    v_display_name := upper(left(v_raw_name, 1)) || lower(substring(v_raw_name FROM 2));

    INSERT INTO public.profiles (id, email, name, xp_total)
    VALUES (v_user.id, v_user.email, v_display_name, 0)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.streaks (user_id, current_streak, best_streak)
    VALUES (v_user.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
  END LOOP;
END;
$$;


-- ==============================================================================
-- SECTION 19: SEED ACHIEVEMENTS (single source of truth — idempotent)
-- ==============================================================================

INSERT INTO achievements (name, description, condition_type, condition_value, icon) VALUES
  ('First Step',       'Complete your very first workout.',   'total_workouts', 1,    '👟'),
  ('Getting Started',  'Complete 5 workouts.',                'total_workouts', 5,    '💪'),
  ('Consistent',       'Complete 10 workouts.',               'total_workouts', 10,   '📅'),
  ('Dedicated',        'Complete 25 workouts.',               'total_workouts', 25,   '🎯'),
  ('Centurion',        'Complete 100 workouts.',              'total_workouts', 100,  '🏅'),
  ('Set Starter',      'Complete 50 total sets.',             'total_sets',     50,   '✅'),
  ('Set Machine',      'Complete 500 total sets.',            'total_sets',     500,  '⚙️'),
  ('Set Legend',       'Complete 2,000 total sets.',          'total_sets',     2000, '🔩'),
  ('3-Day Streak',     'Work out 3 days in a row.',           'streak',         3,    '🔥'),
  ('Iron Will',        'Maintain a 7-day streak.',            'streak',         7,    '⚡'),
  ('Two Weeks Strong', 'Maintain a 14-day streak.',           'streak',         14,   '💎'),
  ('Monthly Beast',    'Maintain a 30-day streak.',           'streak',         30,   '👑'),
  ('Quarter Century',  'Maintain a 90-day streak.',           'streak',         90,   '🏆')
ON CONFLICT (name) DO UPDATE SET
  description     = EXCLUDED.description,
  condition_type  = EXCLUDED.condition_type,
  condition_value = EXCLUDED.condition_value,
  icon            = EXCLUDED.icon;


-- ==============================================================================
-- SECTION 20: SEED EXERCISES (IDs 1–56, matches src/constants/exercises.ts)
-- Uses ON CONFLICT DO UPDATE to be fully idempotent.
-- After seeding, resets the sequence so new auto-inserts don't conflict.
-- ==============================================================================

INSERT INTO exercises (id, name, muscle_group, difficulty, image_url) VALUES
  -- MONDAY: Chest + Triceps
  (1,  'Chest Press (Tube)',               'chest',     'beginner',     '/images/MONDAY/Chest Press.png'),
  (2,  'Push-up Progression',              'chest',     'beginner',     '/images/MONDAY/Push-up.png'),
  (3,  'Incline Chest Press (Tube)',        'chest',     'intermediate', '/images/MONDAY/Incline Chest Press.png'),
  (4,  'Chest Fly (Tube)',                 'chest',     'intermediate', '/images/MONDAY/Chest Fly.png'),
  (5,  'Incline Chest Fly (Tube)',         'chest',     'intermediate', '/images/MONDAY/Incline Chest Fly.png'),
  (6,  'Triceps Pushdown (Tube)',          'triceps',   'beginner',     '/images/MONDAY/Triceps Pushdown.png'),
  (7,  'Overhead Triceps Extension (Tube)','triceps',   'intermediate', '/images/MONDAY/Overhead Triceps Extension.png'),
  -- TUESDAY: Back + Biceps + Forearms
  (8,  'Lat Pulldown (Tube)',              'back',      'beginner',     '/images/TUESDAY/Lat Pulldown.png'),
  (9,  'Bent-Over Row (Tube)',             'back',      'beginner',     '/images/TUESDAY/Bent-Over Row.png'),
  (10, 'Seated Row (Tube)',               'back',      'beginner',     '/images/TUESDAY/Seated Row.png'),
  (11, 'Straight-Arm Pushdown (Tube)',    'back',      'intermediate', '/images/TUESDAY/Straight-Arm Pushdown.png'),
  (12, 'Face Pull (Tube)',                'back',      'beginner',     '/images/TUESDAY/Face Pull.png'),
  (13, 'Biceps Curl (Tube)',              'biceps',    'beginner',     '/images/TUESDAY/Biceps Curl.png'),
  (14, 'Hammer Curl',                     'biceps',    'beginner',     '/images/TUESDAY/Hammer Curl.png'),
  (15, 'Supinating Curl (Alt)',           'biceps',    'intermediate', '/images/TUESDAY/Supinating Curl.png'),
  (16, 'Reverse Curl',                    'forearms',  'beginner',     '/images/TUESDAY/Reverse Curl.png'),
  (17, 'Wrist Curl',                      'forearms',  'beginner',     '/images/TUESDAY/Wrist Curl.png'),
  (18, 'Reverse Wrist Curl',              'forearms',  'beginner',     '/images/TUESDAY/Reverse Wrist Curl.png'),
  (19, 'Farmer Hold',                     'forearms',  'beginner',     '/images/TUESDAY/Farmer Hold.png'),
  (20, 'Push-up Progression',             'chest',     'beginner',     '/images/TUESDAY/Incline Push-up.png'),
  -- WEDNESDAY: Legs + Athletic Strength + Grip
  (21, 'Tube Squat',                      'legs',      'beginner',     '/images/WEDNESDAY/Tube Squat.png'),
  (22, 'Bulgarian Split Squat',           'legs',      'intermediate', '/images/WEDNESDAY/Bulgarian Split Squat.png'),
  (23, 'RDL (Tube)',                      'legs',      'intermediate', '/images/WEDNESDAY/RDL.png'),
  (24, 'Reverse Lunge',                   'legs',      'beginner',     '/images/WEDNESDAY/Reverse Lunge.png'),
  (25, 'Glute Bridge',                    'legs',      'beginner',     '/images/WEDNESDAY/Glute Bridge.png'),
  (26, 'Side Lunge',                      'legs',      'beginner',     '/images/WEDNESDAY/Side Lunge.png'),
  (27, 'Calf Raise',                      'legs',      'beginner',     '/images/WEDNESDAY/Calf Raise.png'),
  (28, 'Step-Ups (Athletic)',             'legs',      'beginner',     '/images/WEDNESDAY/Step-Ups.png'),
  (29, 'Farmer Hold',                     'forearms',  'beginner',     '/images/WEDNESDAY/Farmer Hold.png'),
  (30, 'Wrist Curl',                      'forearms',  'beginner',     '/images/WEDNESDAY/Wrist Curl.png'),
  (31, 'Reverse Wrist Curl',              'forearms',  'beginner',     '/images/WEDNESDAY/Reverse Wrist Curl.png'),
  -- FRIDAY: Shoulders + Chest + Triceps
  (32, 'Shoulder Press (Tube)',           'shoulders', 'beginner',     '/images/FRIDAY/Shoulder Press.png'),
  (33, 'Lateral Raise (Tube)',            'shoulders', 'beginner',     '/images/FRIDAY/Lateral Raise.png'),
  (34, 'Arnold Press',                    'shoulders', 'intermediate', '/images/FRIDAY/Arnold Press.png'),
  (35, 'Rear-Delt Fly',                   'shoulders', 'beginner',     '/images/FRIDAY/Rear-Delt Fly.png'),
  (36, 'Decline Chest Press',             'chest',     'intermediate', '/images/FRIDAY/Decline Chest Press.png'),
  (37, 'Decline Chest Fly',              'chest',     'intermediate', '/images/FRIDAY/Decline Chest Fly.png'),
  (38, 'Triceps Pushdown (Tube)',         'triceps',   'beginner',     '/images/FRIDAY/Triceps Pushdown.png'),
  (39, 'Push-up Progression',             'chest',     'beginner',     '/images/FRIDAY/Incline Push-up.png'),
  -- SATURDAY: Back + Chest + Arms + Forearms
  (40, 'Lat Pulldown (Tube)',             'back',      'beginner',     '/images/SATURDAY/Lat Pulldown.png'),
  (41, 'Bent-Over Row (Tube)',            'back',      'beginner',     '/images/SATURDAY/Bent-Over Row.png'),
  (42, 'Face Pull (Tube)',                'back',      'beginner',     '/images/SATURDAY/Face Pull.png'),
  (43, 'Push-up Progression',             'chest',     'beginner',     '/images/SATURDAY/Push-up.png'),
  (44, 'Chest Fly (Tube)',               'chest',     'intermediate', '/images/SATURDAY/Chest Fly.png'),
  (45, 'Hammer Curl',                     'biceps',    'beginner',     '/images/SATURDAY/Hammer Curl.png'),
  (46, 'Overhead Triceps Extension',      'triceps',   'intermediate', '/images/SATURDAY/Overhead Triceps Extension.png'),
  (47, 'Wrist Curl',                      'forearms',  'beginner',     '/images/SATURDAY/Wrist Curl.png'),
  (48, 'Reverse Wrist Curl',              'forearms',  'beginner',     '/images/SATURDAY/Reverse Wrist Curl.png'),
  (49, 'Farmer Hold',                     'forearms',  'beginner',     '/images/SATURDAY/Farmer Hold.png'),
  -- SUNDAY: Full Body Athletic
  (50, 'Lat Pulldown (Tube)',             'back',      'beginner',     '/images/SUNDAY/Lat Pulldown.png'),
  (51, 'Chest Press (Tube)',              'chest',     'beginner',     '/images/SUNDAY/Chest Press.png'),
  (52, 'RDL (Tube)',                      'legs',      'intermediate', '/images/SUNDAY/RDL.png'),
  (53, 'Step-Ups',                        'legs',      'beginner',     '/images/SUNDAY/Step-Ups.png'),
  (54, 'Shoulder/Lateral Raise (Tube)',  'shoulders', 'beginner',     '/images/SUNDAY/Lateral Raise.png'),
  (55, 'Push-up Progression',             'chest',     'beginner',     '/images/SUNDAY/Push-Up.png'),
  (56, 'Farmer Hold',                     'forearms',  'beginner',     '/images/SUNDAY/Farmer Hold.png')
ON CONFLICT (id) DO UPDATE SET
  name         = EXCLUDED.name,
  muscle_group = EXCLUDED.muscle_group,
  difficulty   = EXCLUDED.difficulty,
  image_url    = EXCLUDED.image_url;

-- Reset ID sequence to MAX(id) so next auto-insert doesn't conflict
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));


-- ==============================================================================
-- SECTION 21: SEED AUXILIARY ROUTINES (Warmup + Cooldown)
-- Inserts warmup and cooldown exercises into auxiliary_routines tables.
-- These are generic (not day-specific) and shown on warmup/cooldown pages.
-- ==============================================================================

-- Warmup routine
INSERT INTO auxiliary_routines (category, image_url)
VALUES ('warmup', '/images/Full Body Warm-Up Routine/Full Body Warm-Up.png')
ON CONFLICT (category) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Cooldown routine
INSERT INTO auxiliary_routines (category, image_url)
VALUES ('cooldown', '/images/Post-Workout Cool Down Routine/Post-Workout Cool Down.png')
ON CONFLICT (category) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Posture routine
INSERT INTO auxiliary_routines (category, image_url)
VALUES ('posture', '/images/Posture Routine/Daily Posture Correction.png')
ON CONFLICT (category) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Knock-knee correction routine
INSERT INTO auxiliary_routines (category, image_url)
VALUES ('knockknee', '/images/Knock Knee Correction Routine/Knock Knee Correction.png')
ON CONFLICT (category) DO UPDATE SET image_url = EXCLUDED.image_url;

-- Seed warmup exercises (replaces generic/wrong jumping jacks set)
-- Uses DO block to get the routine ID safely
DO $$
DECLARE
  v_warmup_id   integer;
  v_cooldown_id integer;
BEGIN
  SELECT id INTO v_warmup_id   FROM auxiliary_routines WHERE category = 'warmup';
  SELECT id INTO v_cooldown_id FROM auxiliary_routines WHERE category = 'cooldown';

  -- Clear existing exercises before re-seeding to avoid duplicates
  DELETE FROM auxiliary_routine_exercises WHERE routine_id = v_warmup_id;
  DELETE FROM auxiliary_routine_exercises WHERE routine_id = v_cooldown_id;

  -- ─── WARMUP EXERCISES (correct per monday–sunday .md specs) ─────────────────
  -- Using generic warmup that covers the common elements across all days.
  -- Day-specific variations are handled in the frontend constants fallback.
  INSERT INTO auxiliary_routine_exercises
    (routine_id, name, duration_seconds, reps, exercise_order, is_deleted)
  VALUES
    (v_warmup_id, 'Marching / Light High Knees',        120,  NULL,          1, false),
    (v_warmup_id, 'Arm Circles + Shoulder Rotations',   60,   NULL,          2, false),
    (v_warmup_id, 'Band Pull-Apart',                    NULL, '2 × 12–15',   3, false),
    (v_warmup_id, 'Dead Bug',                           NULL, '2 × 8–10/side', 4, false),
    (v_warmup_id, 'Plank',                              40,   NULL,          5, false),
    (v_warmup_id, 'Bodyweight Squat (Hip Mobility)',    NULL, '2 × 10',      6, false);

  -- ─── COOLDOWN EXERCISES (correct per monday–sunday .md specs) ───────────────
  INSERT INTO auxiliary_routine_exercises
    (routine_id, name, duration_seconds, reps, exercise_order, is_deleted)
  VALUES
    (v_cooldown_id, 'Lat Stretch',                  30,  NULL,             1, false),
    (v_cooldown_id, 'Chest Stretch',                30,  NULL,             2, false),
    (v_cooldown_id, 'Hip-Flexor Stretch',           30,  NULL,             3, false),
    (v_cooldown_id, 'Quadriceps Stretch',           30,  NULL,             4, false),
    (v_cooldown_id, 'Hamstring Stretch',            30,  NULL,             5, false),
    (v_cooldown_id, 'Wall Angels',                  NULL, '2 × 10',        6, false),
    (v_cooldown_id, 'Butterfly Stretch',            45,  NULL,             7, false),
    (v_cooldown_id, 'Side Lunge (Hip Control)',     NULL, '2 × 8–10/side', 8, false);
END;
$$;


-- ==============================================================================
-- END OF SCHEMA v7.2
-- All sections are idempotent and safe to re-run at any time.
-- Total tables: 22  |  Views: 3  |  Functions: 6  |  Triggers: 7
-- ==============================================================================
