-- ============================================================================
-- NUMESCON 2026 (NBMC&H) — Supabase PostgreSQL Schema & Storage Buckets
-- Run this script once in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. EVENT POSTERS & OFFICIAL RELEASES TABLE
create table if not exists public.event_posters (
  id text primary key,
  title text not null,
  category text not null check (category in ('Keynotes', 'Workshops', 'Competitions', 'Cultural', 'Official Release')),
  tagline text not null default '',
  date_str text not null default '',
  venue text not null default '',
  theme_color text not null default 'from-blue-950 via-slate-900 to-indigo-950',
  badge_bg text not null default 'bg-blue-100 text-blue-900',
  image_url text,
  image_urls jsonb not null default '[]'::jsonb,
  aspect_ratio text not null default '3:4',
  highlight_tag text,
  description text not null default '',
  created_at timestamptz not null default now()
);

-- Safe migration for existing event_posters tables (multi-page posters & competition rules)
alter table public.event_posters
  add column if not exists image_urls jsonb not null default '[]'::jsonb;

create index if not exists idx_event_posters_created_at
  on public.event_posters (created_at desc);

-- 1B. ARCHIVE PHOTOS TABLE (Previous Editions Uploaded by Admin)
create table if not exists public.archive_photos (
  id text primary key,
  year text not null default '2025',
  title text not null,
  category text not null default 'Campus Moments',
  caption text not null default '',
  image_url text not null,
  highlight_tag text,
  created_at timestamptz not null default now()
);

create index if not exists idx_archive_photos_created_at
  on public.archive_photos (created_at desc);

-- 2. STUDENT WORKSHOP REGISTRATIONS TABLE (Clusters A, B, C + Payment Receipt)
create table if not exists public.student_registrations (
  delegate_id text primary key,
  registration_date text not null,
  title text not null,
  full_name text not null,
  college_name text not null,
  roll_number text not null,
  admission_year text not null,
  academic_batch text not null,
  academic_level text not null,
  email text not null,
  phone text not null,
  gender text not null,
  state text not null,
  city text not null,
  need_accommodation boolean not null default false,
  accommodation_type text not null default 'Self Arranged',
  food_preference text not null default 'Vegetarian',
  cluster_id text not null check (cluster_id in ('A', 'B', 'C')),
  selected_workshop_ids jsonb not null default '[]'::jsonb,
  payment_transaction_id text not null,
  payment_receipt_url text not null,
  payment_receipt_name text,
  payment_verification_status text not null default 'Pending Review' check (payment_verification_status in ('Pending Review', 'Verified', 'Rejected')),
  payment_verified_by text,
  payment_verified_at text,
  payment_remarks text,
  created_at timestamptz not null default now()
);

-- Safe migration for existing student_registrations tables
alter table public.student_registrations
  add column if not exists payment_verification_status text not null default 'Pending Review',
  add column if not exists payment_verified_by text,
  add column if not exists payment_verified_at text,
  add column if not exists payment_remarks text;

create index if not exists idx_student_registrations_cluster
  on public.student_registrations (cluster_id);

create index if not exists idx_student_registrations_created_at
  on public.student_registrations (created_at desc);

-- 3. SITE MEDIA & PAYMENT QR CONFIGURATION (Single-row config table)
create table if not exists public.site_media_config (
  id integer primary key default 1 check (id = 1),
  teaser_video_url text,
  teaser_video_title text not null default 'NUMESCON 2026 Official Promo Reel · NBMC&H Sushrutanagar',
  payment_qr_url text,
  payment_upi_id text not null default 'numescon2026.nbmch@sbi',
  payment_account_name text not null default 'NUMESCON 2026 Workshop Committee · NBMC&H',
  updated_at timestamptz not null default now()
);

insert into public.site_media_config (id)
values (1)
on conflict (id) do nothing;

-- 4. ADMIN USERS TABLE (Hidden /admin Console)
create table if not exists public.admin_users (
  id text primary key,
  full_name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'Organizing Committee Admin · NBMC&H',
  security_pin text not null default '2026',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 5. SUPABASE STORAGE BUCKETS FOR POSTERS, TRAILERS, PAYMENT QR & RECEIPTS
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('posters', 'posters', true, 15728640, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('archive', 'archive', true, 15728640, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('videos', 'videos', true, 104857600, array['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']),
  ('payment-qr', 'payment-qr', true, 10485760, array['image/png', 'image/jpeg', 'image/webp']),
  ('receipts', 'receipts', true, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

-- Allow public read access to uploaded posters, archive photos, teaser videos, payment QR, and receipt previews
drop policy if exists "Public read NUMESCON media" on storage.objects;
create policy "Public read NUMESCON media"
  on storage.objects for select
  using (bucket_id in ('posters', 'archive', 'videos', 'payment-qr', 'receipts'));

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- Server API routes use SUPABASE_SERVICE_ROLE_KEY (which bypasses RLS safely
-- on the server). Enabling RLS ensures anonymous browser keys cannot dump PII.
-- ============================================================================

alter table public.event_posters enable row level security;
alter table public.archive_photos enable row level security;
alter table public.site_media_config enable row level security;
alter table public.student_registrations enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read posters" on public.event_posters;
create policy "Public can read posters"
  on public.event_posters for select
  using (true);

drop policy if exists "Public can read archive photos" on public.archive_photos;
create policy "Public can read archive photos"
  on public.archive_photos for select
  using (true);

drop policy if exists "Public can read site media config" on public.site_media_config;
create policy "Public can read site media config"
  on public.site_media_config for select
  using (true);
