import type { ApiResponse, QuoteRange, ServiceId } from "../types/calculator";

const SESSION_KEY = "homesnap.lead.session";

export function getLeadSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `lead_${crypto.randomUUID()}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export async function trackLead(payload: {
  progressStep: number;
  progressLabel?: string;
  serviceId?: ServiceId | null;
  formattedAddress?: string | null;
  placeId?: string | null;
  quote?: QuoteRange | null;
  eventType?: string;
  eventData?: Record<string, unknown>;
  status?: string;
}) {
  try {
    const res = await fetch("/api/leads/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getLeadSessionId(),
        ...payload,
      }),
    });
    const data: ApiResponse<{ lead: unknown }> = await res.json();
    if (!res.ok || !data.success) return null;
    return data.data?.lead;
  } catch {
    return null;
  }
}
