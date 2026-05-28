import "../bootstrap/env.js";
import { getSupabaseAdminClient } from "../lib/supabaseClient.js";

const email = String(process.argv[2] || "").trim().toLowerCase();
const password = String(process.argv[3] || "").trim();

if (!email || !password) {
  console.error("Usage: node backend/scripts/resetAdminPassword.js <email> <new-password>");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const supabase = getSupabaseAdminClient();

const { data: listed, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) {
  console.error("Failed to list users:", listError.message);
  process.exit(1);
}

let user = listed.users.find((u) => String(u.email || "").toLowerCase() === email);

if (!user) {
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "HomeSnap Admin", role: "admin" },
    app_metadata: { role: "admin" },
  });
  if (createError) {
    console.error("Failed to create user:", createError.message);
    process.exit(1);
  }
  user = created.user;
  console.log("Created new Supabase auth user.");
} else {
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { password });
  if (updateError) {
    console.error("Failed to update password:", updateError.message);
    process.exit(1);
  }
  console.log("Password updated for existing user.");
}

await supabase.from("admin_users").upsert(
  {
    id: user.id,
    email,
    full_name: user.user_metadata?.full_name || "HomeSnap Admin",
    role: "admin",
    is_active: true,
    updated_at: new Date().toISOString(),
  },
  { onConflict: "id" },
);

console.log("Admin ready.");
console.log(`Email: ${email}`);
console.log(`Password: ${password}`);
console.log("Login at: http://localhost:3001/admin/login");
