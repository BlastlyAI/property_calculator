const GOOGLE_BASE = "https://maps.googleapis.com/maps/api";

function getKey() {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error("GOOGLE_MAPS_API_KEY is missing. Set it in .env.local");
  }
  return key;
}

function pickAddressParts(components = []) {
  const byType = (type) =>
    components.find((c) => Array.isArray(c.types) && c.types.includes(type))?.long_name ?? null;

  return {
    suburb: byType("locality") || byType("sublocality") || byType("postal_town"),
    state: byType("administrative_area_level_1"),
    postcode: byType("postal_code"),
  };
}

export async function autocompleteAddress(input) {
  const params = new URLSearchParams({
    input,
    key: getKey(),
    components: "country:au",
    types: "address",
  });

  const res = await fetch(`${GOOGLE_BASE}/place/autocomplete/json?${params.toString()}`);
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    if (data.status === "REQUEST_DENIED") {
      throw new Error("Google Places request denied. Check API key, billing, and Places API enablement.");
    }
    throw new Error(`Autocomplete failed: ${data.status}`);
  }
  return (data.predictions || []).map((p) => ({
    placeId: p.place_id,
    mainText: p.structured_formatting?.main_text || p.description,
    secondaryText: p.structured_formatting?.secondary_text || "",
    description: p.description,
  }));
}

export async function geocodeByPlaceId(placeId) {
  const params = new URLSearchParams({
    place_id: placeId,
    key: getKey(),
  });
  const res = await fetch(`${GOOGLE_BASE}/geocode/json?${params.toString()}`);
  const data = await res.json();

  if (data.status !== "OK" || !Array.isArray(data.results) || !data.results[0]) {
    throw new Error(`Geocoding failed: ${data.status}`);
  }

  const result = data.results[0];
  const location = result.geometry?.location;
  const addressParts = pickAddressParts(result.address_components);

  return {
    placeId,
    formattedAddress: result.formatted_address,
    lat: location?.lat ?? null,
    lng: location?.lng ?? null,
    ...addressParts,
  };
}

export function getStaticSatelliteMapUrl({ lat, lng }) {
  try {
    const params = new URLSearchParams({
      center: `${lat},${lng}`,
      zoom: "20",
      size: "1200x800",
      maptype: "satellite",
      markers: `color:red|${lat},${lng}`,
      key: getKey(),
    });
    return `${GOOGLE_BASE}/staticmap?${params.toString()}`;
  } catch {
    const fallbackParams = new URLSearchParams({
      center: `${lat},${lng}`,
      zoom: "18",
      size: "1200x800",
      markers: `${lat},${lng},red-pushpin`,
    });
    return `https://staticmap.openstreetmap.de/staticmap.php?${fallbackParams.toString()}`;
  }
}

