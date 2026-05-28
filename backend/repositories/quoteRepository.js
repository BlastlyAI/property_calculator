import { getSupabaseAdminClient } from "../lib/supabaseClient.js";

export async function createQuoteRecord({ serviceId, quote, answers, property }) {
  const supabase = getSupabaseAdminClient();

  const payload = {
    service_id: serviceId,
    low: Number(quote.low || 0),
    high: Number(quote.high || 0),
    answers: answers || {},
    property_snapshot: {
      placeId: property.placeId,
      formattedAddress: property.formattedAddress,
      suburb: property.suburb || null,
      state: property.state || null,
      postcode: property.postcode || null,
      bedrooms: property.bedrooms ?? null,
      bathrooms: property.bathrooms ?? null,
      sizeBand: property.sizeBand || null,
    },
  };

  const { data, error } = await supabase.from("quotes").insert(payload).select("id, low, high").single();
  if (error) throw new Error(`Failed to create quote: ${error.message}`);
  return data;
}
