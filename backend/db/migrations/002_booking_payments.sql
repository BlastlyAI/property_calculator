-- Stripe payment fields on bookings
alter table public.bookings
  add column if not exists payment_status text not null default 'pending',
  add column if not exists payment_amount integer,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists paid_at timestamptz;

create index if not exists idx_bookings_payment_status on public.bookings(payment_status);
create index if not exists idx_bookings_stripe_pi on public.bookings(stripe_payment_intent_id);
