import { getSupabaseAdminClient } from "../lib/supabaseClient.js";
import { fail } from "../contracts/responseFactory.js";

async function isAdminUser(user) {
  if (user.app_metadata?.role === "admin") return true;

  const allowlist = String(process.env.ADMIN_EMAIL_ALLOWLIST || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowlist.includes(String(user.email || "").toLowerCase())) return true;

  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("admin_users")
    .select("id, is_active")
    .eq("email", user.email)
    .eq("is_active", true)
    .maybeSingle();

  return Boolean(data?.id);
}

export function requireAdmin() {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      if (!header.startsWith("Bearer ")) {
        return res.status(401).json(fail("Missing authorization token", "UNAUTHORIZED"));
      }

      const token = header.slice(7);
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) {
        return res.status(401).json(fail("Invalid or expired session", "UNAUTHORIZED"));
      }

      const allowed = await isAdminUser(data.user);
      if (!allowed) {
        return res.status(403).json(fail("Admin access required", "FORBIDDEN"));
      }

      req.adminUser = data.user;
      req.adminAccessToken = token;
      return next();
    } catch (error) {
      return res.status(500).json(fail(error.message || "Auth check failed"));
    }
  };
}
