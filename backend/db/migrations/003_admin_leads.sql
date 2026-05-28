-- Admin panel + lead tracking schema

create table if not exists public.admin_users (
  id uuid primary key,
  email text not null unique,
  full_name text,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  status text not null default 'active',
  service_id text,
  formatted_address text,
  place_id text,
  quote_low integer,
  quote_high integer,
  progress_step integer not null default 1,
  progress_label text,
  converted_booking_id uuid references public.bookings(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_leads_session_id on public.leads(session_id);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  session_id text,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null default current_date,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (snapshot_date)
);

create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_last_active on public.leads(last_active_at desc);
create index if not exists idx_activity_logs_created on public.activity_logs(created_at desc);
