import { getSupabaseAdminClient } from "../lib/supabaseClient.js";

export async function getBookingById(bookingId) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, booking_reference, service_id, status, booking_date, booking_time, payment_status, payment_amount, stripe_payment_intent_id, paid_at, quote_id, metadata",
    )
    .eq("id", bookingId)
    .single();

  if (error) throw new Error(`Failed to load booking: ${error.message}`);
  return data;
}

export async function updateBookingPayment(bookingId, patch) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", bookingId)
    .select(
      "id, booking_reference, status, payment_status, payment_amount, stripe_payment_intent_id, paid_at",
    )
    .single();

  if (error) throw new Error(`Failed to update booking payment: ${error.message}`);
  return data;
}
