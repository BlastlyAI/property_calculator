# HomeSnap Property Calculator

Frontend + backend calculator app with dynamic service configuration, pluggable address/property providers, and Supabase-backed booking persistence.

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Fill in required keys (especially Supabase vars).
3. Install dependencies:

```bash
pnpm install
```

4. Start frontend + backend:

```bash
pnpm dev
```

## Supabase setup

1. In Supabase SQL editor, run:
   - `backend/db/migrations/001_initial_schema.sql`
2. Add these env vars in `.env.local`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Verify connection:
   - `GET /api/db-test`

The endpoint returns:
- Supabase connection status
- database health
- `bookings`, `quotes`, `customers`, `properties` table availability

## Key backend routes

- `GET /api/property-data`
- `POST /api/quote`
- `POST /api/bookings`
- `GET /api/payments/config`
- `POST /api/payments/create-intent`
- `POST /api/payments/confirm`
- `GET /api/db-test`
- `GET /api/service-configs`

## Stripe sandbox testing

1. Run migration `backend/db/migrations/002_booking_payments.sql` in Supabase.
2. Add `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` to `.env.local`.
3. Complete calculator flow through booking → payment.
4. Use test card `4242 4242 4242 4242` with any future expiry and CVC.
5. Set `PAYMENT_DEBUG=false` to disable payment debug logs in production.

## Admin panel

1. Run migration `backend/db/migrations/003_admin_leads.sql` in Supabase.
2. Create an admin user in Supabase Auth (email/password).
3. Add admin email to `ADMIN_EMAIL_ALLOWLIST` in `.env.local`.
4. Open `http://localhost:3001/admin/login`.

Admin routes:

- `/admin/dashboard`
- `/admin/bookings`
- `/admin/customers`
- `/admin/leads`
- `/admin/analytics`
- `/admin/settings`
