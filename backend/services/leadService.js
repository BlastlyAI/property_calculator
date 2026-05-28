import { getSupabaseAdminClient } from "../lib/supabaseClient.js";

const STEP_LABELS = {
  1: "address_search",
  2: "property_details",
  3: "service_questions",
  4: "estimate",
  5: "booking",
  payment: "payment",
  confirm: "confirmed",
};

function getSessionId(payload) {
  return String(payload?.sessionId || "").trim();
}

export async function trackLeadActivity(payload) {
  const sessionId = getSessionId(payload);
  if (!sessionId) {
    const error = new Error("sessionId is required");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const supabase = getSupabaseAdminClient();
  const progressStep = Number(payload.progressStep || 1);
  const progressLabel = payload.progressLabel || STEP_LABELS[progressStep] || "unknown";

  const leadPatch = {
    session_id: sessionId,
    service_id: payload.serviceId || null,
    formatted_address: payload.formattedAddress || null,
    place_id: payload.placeId || null,
    quote_low: payload.quote?.low ?? null,
    quote_high: payload.quote?.high ?? null,
    progress_step: progressStep,
    progress_label: progressLabel,
    status: payload.status || "active",
    metadata: payload.metadata || {},
    last_active_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .upsert(leadPatch, { onConflict: "session_id" })
    .select("id, session_id, status, progress_step, progress_label, last_active_at")
    .single();

  if (leadError) throw new Error(`Failed to track lead: ${leadError.message}`);

  if (payload.eventType) {
    await supabase.from("activity_logs").insert({
      lead_id: lead.id,
      session_id: sessionId,
      event_type: payload.eventType,
      event_data: payload.eventData || {},
    });
  }

  return lead;
}

export async function markLeadConverted({ sessionId, bookingId }) {
  if (!sessionId || !bookingId) return null;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("leads")
    .update({
      status: "converted",
      converted_booking_id: bookingId,
      progress_label: "converted",
      last_active_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId)
    .select("id, status, converted_booking_id")
    .maybeSingle();

  if (error) throw new Error(`Failed to convert lead: ${error.message}`);
  return data;
}
