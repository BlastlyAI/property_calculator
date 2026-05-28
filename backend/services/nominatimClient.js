const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 10;
const MIN_REQUEST_GAP_MS = 1200;
let lastRequestAt = 0;

function getCached(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function setCached(key, value) {
  cache.set(key, { ts: Date.now(), value });
}

async function rateLimitWait() {
  const now = Date.now();
  const waitFor = Math.max(0, MIN_REQUEST_GAP_MS - (now - lastRequestAt));
  if (waitFor > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitFor));
  }
  lastRequestAt = Date.now();
}

export async function nominatimSearch(query, limit = 8) {
  const key = `search:${query}:${limit}`;
  const cached = getCached(key);
  if (cached) return cached;

  await rateLimitWait();
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    addressdetails: "1",
    extratags: "1",
    namedetails: "1",
    limit: String(limit),
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      "User-Agent": "homesnap-address-search/1.0",
      Accept: "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok || !Array.isArray(data)) {
    throw new Error("Nominatim search failed");
  }
  setCached(key, data);
  return data;
}

