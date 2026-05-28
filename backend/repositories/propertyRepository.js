import { getSupabaseAdminClient } from "../lib/supabaseClient.js";

export async function upsertProperty(propertyData) {
  const supabase = getSupabaseAdminClient();

  const payload = {
    place_id: propertyData.placeId,
    formatted_address: propertyData.formattedAddress,
    suburb: propertyData.suburb || null,
    state: propertyData.state || null,
    postcode: propertyData.postcode || null,
    lat: propertyData.lat ?? null,
    lng: propertyData.lng ?? null,
    property_type: propertyData.propertyType || null,
    size_band: propertyData.sizeBand || null,
    bedrooms: propertyData.bedrooms ?? null,
    bathrooms: propertyData.bathrooms ?? null,
    house_size_sqm: propertyData.houseSizeSqm ?? null,
    land_size_sqm: propertyData.landSizeSqm ?? null,
    metadata: {
      hasPool: propertyData.hasPool ?? null,
      poolSizeSqm: propertyData.poolSizeSqm ?? null,
      windowEstimate: propertyData.windowEstimate ?? null,
      estimationMeta: propertyData.estimationMeta || null,
      provider: propertyData.provider || null,
    },
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("properties")
    .upsert(payload, { onConflict: "place_id" })
    .select("id, place_id")
    .single();

  if (error) throw new Error(`Failed to upsert property: ${error.message}`);
  return data;
}
