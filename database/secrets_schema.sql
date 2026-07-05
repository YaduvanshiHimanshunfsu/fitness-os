-- ==============================================================================
-- SECRETS MANAGEMENT SCHEMA
-- ==============================================================================
-- This table stores sensitive API keys and secrets securely.
-- It is intentionally NOT accessible by the public.

create table if not exists secrets (
  id          serial      primary key,
  key         text        not null unique,
  value       text        not null,
  description text,
  updated_at  timestamptz not null default now()
);

-- Enable RLS for secrets
alter table secrets enable row level security;

-- ONLY Admins can insert/update/select secrets
create policy "Admins can manage secrets"
  on secrets for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
