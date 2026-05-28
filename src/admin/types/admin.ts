export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AdminSession {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface DashboardOverview {
  totals: {
    bookings: number;
    customers: number;
    quotes: number;
    leads: number;
    paidBookings: number;
    pendingBookings: number;
  };
  periods: {
    todayBookings: number;
    weekBookings: number;
    monthBookings: number;
  };
  rates: {
    conversionRate: number;
    paymentSuccessRate: number;
    quoteToBookingRate: number;
  };
}

export interface BookingRow {
  id: string;
  booking_reference: string;
  service_id: string;
  status: string;
  payment_status: string;
  payment_amount: number | null;
  stripe_payment_intent_id: string | null;
  paid_at: string | null;
  booking_date: string;
  booking_time: string;
  created_at: string;
  notes: string | null;
  customers: { full_name: string; phone: string; email: string | null } | null;
  properties: { formatted_address: string; suburb: string | null; state: string | null; postcode: string | null } | null;
  quotes: { low: number; high: number } | null;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}
