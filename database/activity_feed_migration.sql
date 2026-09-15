-- ============================================================
-- Fitness OS v7.0 Migration: Activity Feed + Realtime
-- Run this in your Supabase SQL editor
-- ============================================================

-- 1. Activity feed table
CREATE TABLE IF NOT EXISTS activity_feed (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_name   text NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('workout_completed', 'pr_hit', 'achievement_unlocked', 'streak_milestone')),
  data        jsonb DEFAULT '{}',
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- 2. Index for fast feed queries (newest first)
CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id);

-- 3. RLS: everyone can read, only owner can insert
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_feed_public_read" ON activity_feed;
CREATE POLICY "activity_feed_public_read" ON activity_feed
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "activity_feed_user_insert" ON activity_feed;
CREATE POLICY "activity_feed_user_insert" ON activity_feed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Enable Supabase Realtime on this table
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
