import { nominatimSearch } from "../../services/nominatimClient.js";

function normalizeAddressParts(address = {}) {
  return {
    suburb: address.suburb || address.neighbourhood || address.city_district || address.city || address.town || null,
    state: address.state_code || address.state || null,
    postcode: address.postcode || null,
  };
}

function encode(payload) {
  return `osm_${Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")}`;
}

function decode(id) {
  if (!id?.startsWith("osm_")) return null;
  try {
    return JSON.parse(Buffer.from(id.slice(4), "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function normalizeResult(item) {
  const formattedAddress = item.display_name;
  const lat = Number(item.lat);
  const lng = Number(item.lon);
  const parts = normalizeAddressParts(item.address || {});
  const payload = {
    formattedAddress,
    lat,
    lng,
    ...parts,
    osmClass: item.class || null,
    osmType: item.type || null,
    osmImportance: item.importance ?? null,
    osmAddressType: item.addresstype || null,
    extratags: item.extratags || {},
  };
  return {
    placeId: encode(payload),
    description: formattedAddress,
    mainText: formattedAddress.split(",")[0] || formattedAddress,
    secondaryText: formattedAddress,
    provider: "nominatim",
    ...payload,
  };
}

function extractPostcode(input) {
  const match = input.match(/\b\d{4,6}\b/);
  return match ? match[0] : null;
}

function stripPostcode(input) {
  return input.replace(/\b\d{4,6}\b/g, " ").replace(/\s+/g, " ").trim();
}

function dedupeByPlaceId(results) {
  const seen = new Set();
  const deduped = [];
  for (const item of results) {
    if (seen.has(item.placeId)) continue;
    seen.add(item.placeId);
    deduped.push(item);
  }
  return deduped;
}

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !/^\d+$/.test(t));
}

function scoreCandidate({ rawQuery, postcode, localityTokens }, candidate) {
  const desc = (candidate.description || "").toLowerCase();
  let score = 0;
  if (postcode && desc.includes(postcode)) score += 30;
  for (const token of localityTokens) {
    if (desc.includes(token)) score += 18;
  }
  // slight preference for Indian addresses for this project's current usage
  if (rawQuery.toLowerCase().includes("india") || localityTokens.some((t) => ["indore", "mumbai", "delhi", "pune", "bangalore"].includes(t))) {
    if (desc.includes("india")) score += 25;
  }
  if (candidate.osmAddressType === "building" || candidate.osmAddressType === "house") score += 8;
  return score;
}

export const nominatimProvider = {
  id: "nominatim",
  async search(input) {
    const query = input.trim();
    const postcode = extractPostcode(query);
    const withoutPostcode = stripPostcode(query);

    const batches = [];
    const primary = await nominatimSearch(query, 8);
    batches.push(primary);

    // If house-level query misses, retry using postcode-area strategy.
    if (primary.length < 3 && postcode) {
      const postcodeArea = await nominatimSearch(postcode, 8);
      batches.push(postcodeArea);

      if (withoutPostcode && withoutPostcode.length >= 3) {
        const blended = await nominatimSearch(`${withoutPostcode} ${postcode}`, 8);
        batches.push(blended);
      }
    }

    const merged = batches.flat().map(normalizeResult);
    const deduped = dedupeByPlaceId(merged);
    const localityTokens = tokenize(withoutPostcode || query);
    return deduped
      .map((item) => ({
        item,
        score: scoreCandidate({ rawQuery: query, postcode, localityTokens }, item),
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  },
  async resolve(selectionId) {
    const decoded = decode(selectionId);
    if (!decoded) throw new Error("Invalid nominatim selection id");
    return {
      placeId: selectionId,
      formattedAddress: decoded.formattedAddress,
      lat: decoded.lat,
      lng: decoded.lng,
      suburb: decoded.suburb || null,
      state: decoded.state || null,
      postcode: decoded.postcode || null,
      osmClass: decoded.osmClass || null,
      osmType: decoded.osmType || null,
      osmImportance: decoded.osmImportance ?? null,
      osmAddressType: decoded.osmAddressType || null,
      extratags: decoded.extratags || {},
      provider: "nominatim",
    };
  },
};

