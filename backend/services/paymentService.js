import { paymentLog } from "../lib/paymentDebug.js";
import { getBookingById, updateBookingPayment } from "../repositories/bookingRepository.js";
import { getSupabaseAdminClient } from "../lib/supabaseClient.js";
import {
  createPaymentIntentForBooking,
  getStripePublishableKey,
  quoteToDepositCents,
  verifyPaymentSucceeded,
} from "./stripeService.js";

export function getPaymentConfig() {
  return {
    publishableKey: getStripePublishableKey(),
    currency: "aud",
  };
}

async function loadQuoteForBooking(booking) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("quotes").select("low, high").eq("id", booking.quote_id).single();
  if (error) throw new Error(`Failed to load quote for booking: ${error.message}`);
  return data;
}

export async function startPaymentForBooking({ bookingId, customerEmail }) {
  if (!bookingId) {
    const error = new Error("bookingId is required");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const booking = await getBookingById(bookingId);
  if (booking.payment_status === "paid") {
    return {
      alreadyPaid: true,
      booking,
      clientSecret: null,
      publishableKey: getStripePublishableKey(),
      amountCents: booking.payment_amount || 0,
    };
  }

  const quote = await loadQuoteForBooking(booking);
  const { paymentIntent, amountCents, reused, alreadyPaid } = await createPaymentIntentForBooking({
    booking,
    quote,
    customerEmail,
  });

  await updateBookingPayment(bookingId, {
    stripe_payment_intent_id: paymentIntent.id,
    payment_amount: amountCents,
    payment_status: alreadyPaid ? "paid" : "pending",
    status: alreadyPaid ? "confirmed" : booking.status === "confirmed" ? "confirmed" : "pending_payment",
    paid_at: alreadyPaid ? new Date().toISOString() : null,
  });

  paymentLog("Payment session started", { bookingId, paymentIntentId: paymentIntent.id, reused });

  return {
    alreadyPaid: Boolean(alreadyPaid),
    booking: await getBookingById(bookingId),
    clientSecret: paymentIntent.client_secret,
    publishableKey: getStripePublishableKey(),
    amountCents,
    depositAud: amountCents / 100,
  };
}

export async function confirmPaymentForBooking({ bookingId, paymentIntentId }) {
  if (!bookingId || !paymentIntentId) {
    const error = new Error("bookingId and paymentIntentId are required");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const booking = await getBookingById(bookingId);
  const paymentIntent = await verifyPaymentSucceeded(paymentIntentId);

  if (paymentIntent.metadata?.bookingId && paymentIntent.metadata.bookingId !== bookingId) {
    const error = new Error("Payment intent does not match booking");
    error.code = "PAYMENT_MISMATCH";
    throw error;
  }

  if (paymentIntent.status !== "succeeded") {
    const error = new Error(`Payment not completed. Status: ${paymentIntent.status}`);
    error.code = "PAYMENT_INCOMPLETE";
    error.details = { status: paymentIntent.status };
    throw error;
  }

  const updated = await updateBookingPayment(bookingId, {
    stripe_payment_intent_id: paymentIntent.id,
    payment_amount: paymentIntent.amount,
    payment_status: "paid",
    status: "confirmed",
    paid_at: new Date().toISOString(),
    metadata: {
      ...(booking.metadata || {}),
      stripePaymentStatus: paymentIntent.status,
      stripeChargeId: paymentIntent.latest_charge || null,
    },
  });

  paymentLog("Payment confirmed and booking updated", { bookingId, paymentIntentId });

  return {
    booking: updated,
    payment: {
      status: paymentIntent.status,
      amountCents: paymentIntent.amount,
      currency: paymentIntent.currency,
    },
  };
}

export function calculateDepositFromQuote(quote) {
  return {
    amountCents: quoteToDepositCents(quote),
    amountAud: quoteToDepositCents(quote) / 100,
  };
}
