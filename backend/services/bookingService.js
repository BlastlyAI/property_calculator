import { getSupabaseAdminClient } from "../lib/supabaseClient.js";
import { upsertProperty } from "../repositories/propertyRepository.js";
import { createQuoteRecord } from "../repositories/quoteRepository.js";
import { upsertCustomer } from "./customerService.js";
import { quoteToDepositCents } from "./stripeService.js";

function toIsoDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function validateBookingPayload(payload) {
  const errors = [];
  if (!payload?.serviceId) errors.push("serviceId is required");
  if (!payload?.property?.placeId) errors.push("property.placeId is required");
  if (!payload?.property?.formattedAddress) errors.push("property.formattedAddress is required");
  if (!payload?.quote || typeof payload.quote.low !== "number" || typeof payload.quote.high !== "number") {
    errors.push("quote.low and quote.high are required");
  }
  if (!payload?.customer?.fullName) errors.push("customer.fullName is required");
  if (!payload?.customer?.phone) errors.push("customer.phone is required");
  if (!payload?.schedule?.date) errors.push("schedule.date is required");
  if (!payload?.schedule?.time) errors.push("schedule.time is required");

  const isoDate = toIsoDate(payload?.schedule?.date);
  if (payload?.schedule?.date && !isoDate) errors.push("schedule.date must be a valid date");

  return { isValid: errors.length === 0, errors, isoDate };
}

export async function createBooking(payload) {
  const validation = validateBookingPayload(payload);
  if (!validation.isValid) {
    const error = new Error("Invalid booking payload");
    error.code = "VALIDATION_ERROR";
    error.details = validation.errors;
    throw error;
  }

  const customer = await upsertCustomer(payload.customer);
  const property = await upsertProperty(payload.property);
  const quote = await createQuoteRecord({
    serviceId: payload.serviceId,
    quote: payload.quote,
    answers: payload.answers || {},
    property: payload.property,
  });

  const supabase = getSupabaseAdminClient();
  const depositCents = quoteToDepositCents(payload.quote);

  const bookingPayload = {
    service_id: payload.serviceId,
    customer_id: customer.id,
    property_id: property.id,
    quote_id: quote.id,
    booking_date: validation.isoDate,
    booking_time: payload.schedule.time,
    notes: payload.schedule.notes || null,
    status: "pending_payment",
    payment_status: "pending",
    payment_amount: depositCents,
    source: "calculator",
    metadata: {
      uiVersion: "v1",
      addressProvider: payload.property.provider || null,
      depositAud: depositCents / 100,
    },
    updated_at: new Date().toISOString(),
  };

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert(bookingPayload)
    .select(
      "id, booking_reference, status, booking_date, booking_time, payment_status, payment_amount, created_at",
    )
    .single();

  if (bookingError) throw new Error(`Failed to create booking: ${bookingError.message}`);

  return { booking, customer, property, quote };
}
