import { getSupabaseAdminClient } from "../lib/supabaseClient.js";
import { getSupabaseAuthClient } from "../lib/supabaseAuthClient.js";

export async function adminLogin({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "");
  if (!normalizedEmail || !normalizedPassword) {
    const error = new Error("Email and password are required");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const authClient = getSupabaseAuthClient();
  const { data, error } = await authClient.auth.signInWithPassword({
    email: normalizedEmail,
    password: normalizedPassword,
  });

  if (error) {
    const authError = new Error(error.message || "Invalid login credentials");
    authError.code = "AUTH_FAILED";
    throw authError;
  }

  const user = data.user;
  const token = data.session?.access_token;
  if (!user || !token) {
    const authError = new Error("Authentication session was not created");
    authError.code = "AUTH_FAILED";
    throw authError;
  }

  const supabase = getSupabaseAdminClient();
  const allowlist = String(process.env.ADMIN_EMAIL_ALLOWLIST || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const isAllowlisted = allowlist.includes(normalizedEmail);
  const isRoleAdmin = user.app_metadata?.role === "admin";

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("id, email, full_name, role, is_active")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (!isAllowlisted && !isRoleAdmin && (!adminRow || !adminRow.is_active)) {
    const authError = new Error("This account is not authorized for admin access");
    authError.code = "FORBIDDEN";
    throw authError;
  }

  if (!adminRow) {
    await supabase.from("admin_users").upsert(
      {
        id: user.id,
        email: normalizedEmail,
        full_name: user.user_metadata?.full_name || normalizedEmail,
        role: "admin",
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || adminRow?.full_name || normalizedEmail,
      role: adminRow?.role || "admin",
    },
    session: {
      accessToken: token,
      refreshToken: data.session?.refresh_token || null,
      expiresAt: data.session?.expires_at || null,
    },
  };
}

export async function adminGetSession(accessToken) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) {
    const authError = new Error("Invalid session");
    authError.code = "UNAUTHORIZED";
    throw authError;
  }
  return { user: data.user };
}

export async function adminLogout() {
  const authClient = getSupabaseAuthClient();
  await authClient.auth.signOut();
  return { success: true };
}
