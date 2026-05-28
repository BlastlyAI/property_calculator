function normalizeAddressParts(components = {}) {
  return {
    suburb: components.suburb || components.city || components.town || components.village || null,
    state: components.state_code || components.state || null,
    postcode: components.postcode || null,
  };
}

function hasStreetLevelMatch(query, formattedAddress) {
  const q = query.toLowerCase();
  const f = (formattedAddress || "").toLowerCase();
  const hasNumberInQuery = /\d/.test(q);
  const hasNumberInResult = /\d/.test(f);
  if (!hasNumberInQuery) return true;
  return hasNumberInResult;
}

function encodeSelection(payload) {
  return `oc_${Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")}`;
}

function encodeOsmSelection(payload) {
  return `osm_${Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")}`;
}

function decodeSelection(id) {
  if (!id?.startsWith("oc_") && !id?.startsWith("osm_")) return null;
  try {
    const raw = Buffer.from(id.slice(id.indexOf("_") + 1), "base64url").toString("utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getKey() {
  const key = process.env.GEOCODING_API_KEY;
  if (!key) throw new Error("GEOCODING_API_KEY is missing in .env.local");
  return key;
}

async function openCageSearch(input) {
  const paramsObject = {
    key: getKey(),
    q: input,
    limit: "8",
    no_annotations: "1",
  };
  const countryCode = process.env.FALLBACK_COUNTRY_CODE;
  if (countryCode) paramsObject.countrycode = countryCode;
  const params = new URLSearchParams(paramsObject);
  const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || !Array.isArray(data.results)) {
    throw new Error("Fallback geocoding search failed.");
  }
  return data.results.map((result) => {
    const parts = normalizeAddressParts(result.components);
    const lat = result.geometry?.lat ?? null;
    const lng = result.geometry?.lng ?? null;
    const formattedAddress = result.formatted;
    const placeId = encodeSelection({ formattedAddress, lat, lng, ...parts });
    return {
      placeId,
      description: formattedAddress,
      mainText: formattedAddress.split(",")[0] || formattedAddress,
      secondaryText: formattedAddress,
      formattedAddress,
      lat,
      lng,
      ...parts,
      provider: "fallback",
    };
  });
}

async function nominatimSearch(input) {
  const params = new URLSearchParams({
    q: input,
    format: "jsonv2",
    addressdetails: "1",
    limit: "8",
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      "User-Agent": "homesnap-address-search/1.0",
      Accept: "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok || !Array.isArray(data)) return [];
  return data.map((result) => {
    const formattedAddress = result.display_name;
    const parts = normalizeAddressParts(result.address || {});
    const lat = Number(result.lat);
    const lng = Number(result.lon);
    const placeId = encodeOsmSelection({ formattedAddress, lat, lng, ...parts });
    return {
      placeId,
      description: formattedAddress,
      mainText: formattedAddress.split(",")[0] || formattedAddress,
      secondaryText: formattedAddress,
      formattedAddress,
      lat,
      lng,
      ...parts,
      provider: "fallback",
    };
  });
}

export const fallbackProvider = {
  id: "fallback",
  async search(input) {
    const primary = await openCageSearch(input);
    const needsPreciseMatch =
      /\d/.test(input) && (!primary[0] || !hasStreetLevelMatch(input, primary[0].formattedAddress));
    if (needsPreciseMatch) {
      const osm = await nominatimSearch(input);
      if (osm.length) return osm;
    }
    return primary;
  },
  async resolve(selectionId) {
    const decoded = decodeSelection(selectionId);
    if (!decoded) throw new Error("Invalid fallback selection id");
    return {
      placeId: selectionId,
      formattedAddress: decoded.formattedAddress,
      lat: decoded.lat,
      lng: decoded.lng,
      suburb: decoded.suburb || null,
      state: decoded.state || null,
      postcode: decoded.postcode || null,
      provider: "fallback",
    };
  },
};

