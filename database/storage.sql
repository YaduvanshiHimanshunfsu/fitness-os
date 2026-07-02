-- ==============================================================================
-- PHASE 5: STORAGE CONFIGURATION FOR EXERCISE IMAGES
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. Create the bucket if it doesn't exist (public bucket)
insert into storage.buckets (id, name, public)
values ('exercise_images', 'exercise_images', true)
on conflict (id) do nothing;

-- 2. Drop existing policies on objects in this bucket if any
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Admin Upload Access" on storage.objects;
drop policy if exists "Admin Delete Access" on storage.objects;

-- 3. Create Policy: Anyone can view exercise images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'exercise_images' );

-- 4. Create Policy: Only Admin can insert/upload
create policy "Admin Upload Access"
on storage.objects for insert
with check (
  bucket_id = 'exercise_images' 
  and (
    auth.uid() in (
      select id from public.profiles where role = 'admin' or email = 'himanshu98075@gmail.com'
    )
  )
);

-- 5. Create Policy: Only Admin can delete
create policy "Admin Delete Access"
on storage.objects for delete
using (
  bucket_id = 'exercise_images' 
  and (
    auth.uid() in (
      select id from public.profiles where role = 'admin' or email = 'himanshu98075@gmail.com'
    )
  )
);
