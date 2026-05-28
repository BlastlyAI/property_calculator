import Stripe from "stripe";
import { paymentLog } from "../lib/paymentDebug.js";

let stripeClient = null;

function readStripeEnv() {
  return {
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
  };
}

export function getStripeConfigStatus() {
  const { secretKey, publishableKey } = readStripeEnv();
  return {
    hasSecretKey: Boolean(secretKey),
    hasPublishableKey: Boolean(publishableKey),
    isConfigured: Boolean(secretKey && publishableKey),
  };
}

export function getStripePublishableKey() {
  const { publishableKey } = readStripeEnv();
  if (!publishableKey) {
    throw new Error("STRIPE_PUBLISHABLE_KEY is not configured");
  }
  return publishableKey;
}

function getStripeClient() {
  const { secretKey } = readStripeEnv();
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

export function quoteToDepositCents(quote) {
  const low = Number(quote?.low || 0);
  const high = Number(quote?.high || low);
  const midpoint = Math.round((low + high) / 2);
  const amountAud = Math.max(low, midpoint);
  return Math.max(50, amountAud) * 100;
}

export async function createPaymentIntentForBooking({ booking, quote, customerEmail }) {
  const stripe = getStripeClient();
  const amount = quoteToDepositCents(quote);

  if (booking.stripe_payment_intent_id) {
    try {
      const existing = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id);
      if (existing.status === "requires_payment_method" || existing.status === "requires_confirmation") {
        paymentLog("Reusing existing payment intent", { id: existing.id, status: existing.status });
        return { paymentIntent: existing, amountCents: existing.amount, reused: true };
      }
      if (existing.status === "succeeded") {
        return { paymentIntent: existing, amountCents: existing.amount, reused: true, alreadyPaid: true };
      }
    } catch (error) {
      paymentLog("Could not reuse payment intent, creating new one", { message: error.message });
    }
  }

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount,
      currency: "aud",
      automatic_payment_methods: { enabled: true },
      metadata: {
        bookingId: booking.id,
        bookingReference: booking.booking_reference,
        serviceId: booking.service_id,
      },
      receipt_email: customerEmail || undefined,
      description: `HomeSnap booking ${booking.booking_reference}`,
    },
    { idempotencyKey: `booking-${booking.id}-${amount}` },
  );

  paymentLog("Created payment intent", { id: paymentIntent.id, amount });
  return { paymentIntent, amountCents: amount, reused: false };
}

export async function retrievePaymentIntent(paymentIntentId) {
  const stripe = getStripeClient();
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function verifyPaymentSucceeded(paymentIntentId) {
  const paymentIntent = await retrievePaymentIntent(paymentIntentId);
  paymentLog("Verified payment intent", { id: paymentIntent.id, status: paymentIntent.status });
  return paymentIntent;
}
