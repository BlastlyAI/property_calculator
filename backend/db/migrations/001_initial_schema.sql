-- HomeSnap core operational schema
-- Run this in Supabase SQL editor or via migration tooling.

create extension if not exists "pgcrypto";

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  place_id text not null unique,
  formatted_address text not null,
  suburb text,
  state text,
  postcode text,
  lat double precision,
  lng double precision,
  property_type text,
  size_band text,
  bedrooms integer,
  bathrooms integer,
  house_size_sqm integer,
  land_size_sqm integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  service_id text not null,
  low integer not null,
  high integer not null,
  answers jsonb not null default '{}'::jsonb,
  property_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique default ('HS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  service_id text not null,
  customer_id uuid not null references public.customers(id) on delete restrict,
  property_id uuid not null references public.properties(id) on delete restrict,
  quote_id uuid not null references public.quotes(id) on delete restrict,
  booking_date date not null,
  booking_time text not null,
  notes text,
  status text not null default 'pending_payment',
  payment_status text not null default 'pending',
  payment_amount integer,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  source text not null default 'calculator',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_customers_phone on public.customers(phone);
create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_quotes_service on public.quotes(service_id);
create index if not exists idx_bookings_date on public.bookings(booking_date);
create index if not exists idx_bookings_customer on public.bookings(customer_id);
create index if not exists idx_bookings_property on public.bookings(property_id);
