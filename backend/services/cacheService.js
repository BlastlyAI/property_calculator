import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.resolve(process.cwd(), "backend", "cache", "property-cache.json");
const TTL_MS = 1000 * 60 * 60 * 24;

async function ensureCacheFile() {
  const dir = path.dirname(CACHE_FILE);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(CACHE_FILE);
  } catch {
    await fs.writeFile(CACHE_FILE, JSON.stringify({}, null, 2), "utf8");
  }
}

async function readCache() {
  await ensureCacheFile();
  const raw = await fs.readFile(CACHE_FILE, "utf8");
  return JSON.parse(raw || "{}");
}

async function writeCache(data) {
  await ensureCacheFile();
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function getCachedProperty(key) {
  const cache = await readCache();
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > TTL_MS) return null;
  return entry.value;
}

export async function setCachedProperty(key, value) {
  const cache = await readCache();
  cache[key] = { cachedAt: Date.now(), value };
  await writeCache(cache);
}

