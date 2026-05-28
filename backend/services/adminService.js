import { getSupabaseAdminClient } from "../lib/supabaseClient.js";

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export async function getDashboardOverview() {
  const supabase = getSupabaseAdminClient();
  const today = startOfDay();
  const weekAgo = daysAgo(7);
  const monthAgo = daysAgo(30);

  const [
    bookingsRes,
    customersRes,
    quotesRes,
    leadsRes,
    paidRes,
    pendingRes,
    todayBookingsRes,
    weekBookingsRes,
    monthBookingsRes,
  ] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("payment_status", "paid"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .in("status", ["requested", "pending_payment"]),
    supabase.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", today),
    supabase.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", monthAgo),
  ]);

  const totalBookings = bookingsRes.count || 0;
  const totalLeads = leadsRes.count || 0;
  const totalQuotes = quotesRes.count || 0;
  const totalPaid = paidRes.count || 0;
  const conversionRate = totalLeads > 0 ? Number(((totalBookings / totalLeads) * 100).toFixed(1)) : 0;
  const paymentSuccessRate =
    totalBookings > 0 ? Number(((totalPaid / totalBookings) * 100).toFixed(1)) : 0;

  return {
    totals: {
      bookings: totalBookings,
      customers: customersRes.count || 0,
      quotes: totalQuotes,
      leads: totalLeads,
      paidBookings: totalPaid,
      pendingBookings: pendingRes.count || 0,
    },
    periods: {
      todayBookings: todayBookingsRes.count || 0,
      weekBookings: weekBookingsRes.count || 0,
      monthBookings: monthBookingsRes.count || 0,
    },
    rates: {
      conversionRate,
      paymentSuccessRate,
      quoteToBookingRate: totalQuotes > 0 ? Number(((totalBookings / totalQuotes) * 100).toFixed(1)) : 0,
    },
  };
}

export async function listBookings({
  search = "",
  status = "",
  paymentStatus = "",
  page = 1,
  pageSize = 20,
  sortBy = "created_at",
  sortDir = "desc",
}) {
  const supabase = getSupabaseAdminClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("bookings")
    .select(
      `
      id, booking_reference, service_id, status, payment_status, payment_amount,
      stripe_payment_intent_id, paid_at, booking_date, booking_time, created_at, notes,
      customers ( id, full_name, phone, email ),
      properties ( formatted_address, suburb, state, postcode ),
      quotes ( low, high )
    `,
      { count: "exact" },
    );

  if (status) query = query.eq("status", status);
  if (paymentStatus) query = query.eq("payment_status", paymentStatus);
  if (search) {
    query = query.or(
      `booking_reference.ilike.%${search}%,service_id.ilike.%${search}%,booking_time.ilike.%${search}%`,
    );
  }

  query = query.order(sortBy, { ascending: sortDir === "asc" }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(`Failed to list bookings: ${error.message}`);

  return {
    items: data || [],
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
    },
  };
}

export async function updateBookingStatus(bookingId, { status, paymentStatus }) {
  const supabase = getSupabaseAdminClient();
  const patch = { updated_at: new Date().toISOString() };
  if (status) patch.status = status;
  if (paymentStatus) patch.payment_status = paymentStatus;

  const { data, error } = await supabase
    .from("bookings")
    .update(patch)
    .eq("id", bookingId)
    .select(
      "id, booking_reference, status, payment_status, payment_amount, stripe_payment_intent_id, paid_at",
    )
    .single();

  if (error) throw new Error(`Failed to update booking: ${error.message}`);
  return data;
}

export async function listCustomers({ search = "", page = 1, pageSize = 20 }) {
  const supabase = getSupabaseAdminClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("customers")
    .select("id, full_name, phone, email, created_at, updated_at", { count: "exact" });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) throw new Error(`Failed to list customers: ${error.message}`);

  const enriched = await Promise.all(
    (data || []).map(async (customer) => {
      const { count: bookingCount } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("customer_id", customer.id);

      const { data: paidBookings } = await supabase
        .from("bookings")
        .select("payment_amount, payment_status")
        .eq("customer_id", customer.id)
        .eq("payment_status", "paid");

      const totalSpendCents = (paidBookings || []).reduce((sum, row) => sum + (row.payment_amount || 0), 0);

      return {
        ...customer,
        bookingCount: bookingCount || 0,
        totalSpendAud: totalSpendCents / 100,
      };
    }),
  );

  return {
    items: enriched,
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
    },
  };
}

export async function getCustomerDetail(customerId) {
  const supabase = getSupabaseAdminClient();

  const { data: customer, error } = await supabase
    .from("customers")
    .select("id, full_name, phone, email, created_at, updated_at")
    .eq("id", customerId)
    .single();

  if (error) throw new Error(`Failed to load customer: ${error.message}`);

  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
      id, booking_reference, service_id, status, payment_status, payment_amount, paid_at, booking_date, booking_time, created_at,
      properties ( formatted_address, suburb, state, postcode, bedrooms, bathrooms, property_type )
    `,
    )
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  const totalSpendCents = (bookings || [])
    .filter((b) => b.payment_status === "paid")
    .reduce((sum, row) => sum + (row.payment_amount || 0), 0);

  return { customer, bookings: bookings || [], totalSpendAud: totalSpendCents / 100 };
}

export async function listLeads({ search = "", status = "active", page = 1, pageSize = 20 }) {
  const supabase = getSupabaseAdminClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("leads")
    .select(
      "id, session_id, status, service_id, formatted_address, quote_low, quote_high, progress_step, progress_label, last_active_at, created_at, converted_booking_id",
      { count: "exact" },
    );

  if (status && status !== "all") query = query.eq("status", status);
  if (search) {
    query = query.or(
      `formatted_address.ilike.%${search}%,service_id.ilike.%${search}%,progress_label.ilike.%${search}%`,
    );
  }

  const { data, error, count } = await query.order("last_active_at", { ascending: false }).range(from, to);
  if (error) throw new Error(`Failed to list leads: ${error.message}`);

  return {
    items: data || [],
    pagination: {
      page,
      pageSize,
      total: count || 0,
      totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
    },
  };
}

export async function getAnalytics() {
  const supabase = getSupabaseAdminClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("service_id, payment_status, status, created_at, payment_amount");

  const { data: leads } = await supabase.from("leads").select("status, progress_step, service_id");

  const serviceMap = new Map();
  for (const booking of bookings || []) {
    const key = booking.service_id || "unknown";
    const current = serviceMap.get(key) || { bookings: 0, paid: 0, revenueCents: 0 };
    current.bookings += 1;
    if (booking.payment_status === "paid") {
      current.paid += 1;
      current.revenueCents += booking.payment_amount || 0;
    }
    serviceMap.set(key, current);
  }

  const topServices = [...serviceMap.entries()]
    .map(([serviceId, stats]) => ({
      serviceId,
      bookings: stats.bookings,
      paid: stats.paid,
      revenueAud: stats.revenueCents / 100,
      conversionPct: stats.bookings > 0 ? Number(((stats.paid / stats.bookings) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.bookings - a.bookings);

  const trendMap = new Map();
  for (const booking of bookings || []) {
    const day = new Date(booking.created_at).toISOString().slice(0, 10);
    trendMap.set(day, (trendMap.get(day) || 0) + 1);
  }

  const bookingTrend = [...trendMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  const abandoned = (leads || []).filter((l) => l.status === "active").length;
  const converted = (leads || []).filter((l) => l.status === "converted").length;
  const totalLeads = leads?.length || 0;

  return {
    topServices,
    bookingTrend,
    leadFunnel: {
      totalLeads,
      activeLeads: abandoned,
      convertedLeads: converted,
      abandonmentRate: totalLeads > 0 ? Number(((abandoned / totalLeads) * 100).toFixed(1)) : 0,
    },
    paymentStats: {
      paid: (bookings || []).filter((b) => b.payment_status === "paid").length,
      pending: (bookings || []).filter((b) => b.payment_status === "pending").length,
      failed: (bookings || []).filter((b) => b.payment_status === "failed").length,
    },
  };
}
