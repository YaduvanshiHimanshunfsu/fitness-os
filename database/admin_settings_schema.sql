-- Create the app_settings table
create table if not exists app_settings (
  id          serial      primary key,
  key         text        not null unique,
  value       jsonb       not null,
  updated_at  timestamptz not null default now()
);

-- Enable RLS for app_settings
alter table app_settings enable row level security;

-- Public read access to settings
drop policy if exists "Public can read app_settings" on app_settings;
create policy "Public can read app_settings"
  on app_settings for select using (true);

-- Admin write access to settings
drop policy if exists "Admins can insert/update app_settings" on app_settings;
create policy "Admins can insert/update app_settings"
  on app_settings for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Create the admin_logs table
create table if not exists admin_logs (
  id          serial      primary key,
  admin_id    uuid        not null references profiles(id) on delete cascade,
  action      text        not null,
  details     jsonb,
  created_at  timestamptz not null default now()
);

-- Enable RLS for admin_logs
alter table admin_logs enable row level security;

-- Admin read/write access to logs
drop policy if exists "Admins can manage admin_logs" on admin_logs;
create policy "Admins can manage admin_logs"
  on admin_logs for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );
