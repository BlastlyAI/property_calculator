/** Railway/production API. Leave empty in local dev to use Vite proxy (/api → localhost:3002). */
const DEFAULT_PRODUCTION_API = "https://prmoto-production.up.railway.app";

function normalizeBaseUrl(base: string) {
  return base.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  const fromEnv = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  if (fromEnv) return normalizeBaseUrl(fromEnv);

  if (import.meta.env.PROD) return normalizeBaseUrl(DEFAULT_PRODUCTION_API);

  return "";
}

export function apiUrl(path: string) {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}
