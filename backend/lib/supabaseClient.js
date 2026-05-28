import { createClient } from "@supabase/supabase-js";

let supabaseAdmin = null;
let lastConfigKey = null;

function readSupabaseEnv() {
  return {
    supabaseUrl: process.env.SUPABASE_URL || "",
    anonKey: process.env.SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}

function ensureClient() {
  const { supabaseUrl, serviceRoleKey } = readSupabaseEnv();
  const configKey = `${supabaseUrl}::${serviceRoleKey}`;
  if (!supabaseUrl || !serviceRoleKey) {
    supabaseAdmin = null;
    lastConfigKey = null;
    return null;
  }

  if (!supabaseAdmin || configKey !== lastConfigKey) {
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application-name": "homesnap-backend" } },
    });
    lastConfigKey = configKey;
  }
  return supabaseAdmin;
}

export function getSupabaseAdminClient() {
  const client = ensureClient();
  if (!client) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return client;
}

export function initSupabaseClient() {
  return Boolean(ensureClient());
}

export function getSupabaseConfigStatus() {
  const { supabaseUrl, anonKey, serviceRoleKey } = readSupabaseEnv();
  const isConfigured = Boolean(supabaseUrl && serviceRoleKey);
  return {
    hasUrl: Boolean(supabaseUrl),
    hasAnonKey: Boolean(anonKey),
    hasServiceRoleKey: Boolean(serviceRoleKey),
    isConfigured,
  };
}
