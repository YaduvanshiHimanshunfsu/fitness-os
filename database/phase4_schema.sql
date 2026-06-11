-- ==============================================================================
-- FITNESS OS — PHASE 4 DATABASE SCHEMA
-- Run this file in Supabase SQL Editor to support Body Metrics tracking.
-- ==============================================================================

-- Body Metrics Tracking
create table if not exists body_metrics (
  id                  serial      primary key,
  user_id             uuid        not null references profiles(id) on delete cascade,
  weight_kg           numeric     not null,
  body_fat_percentage numeric,
  measured_at         timestamptz not null default now(),
  notes               text,
  created_at          timestamptz not null default now()
);

-- Index for fast user-specific lookups
create index if not exists idx_body_metrics_user_id
  on body_metrics(user_id, measured_at desc);

-- RLS Policies
alter table body_metrics enable row level security;

drop policy if exists "body_metrics_all_own" on body_metrics;
create policy "body_metrics_all_own" on body_metrics for all using (auth.uid() = user_id);
