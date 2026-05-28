import { getSupabaseAdminClient } from "../lib/supabaseClient.js";

export async function upsertCustomer({ fullName, phone, email }) {
  const supabase = getSupabaseAdminClient();

  const normalizedPhone = String(phone || "").trim();
  if (!normalizedPhone) throw new Error("phone is required");

  const normalizedEmail = String(email || "").trim().toLowerCase() || null;
  const normalizedName = String(fullName || "").trim();

  const query = supabase.from("customers").select("id, full_name, phone, email").eq("phone", normalizedPhone).limit(1);
  const { data: existing, error: findError } = normalizedEmail
    ? await query.eq("email", normalizedEmail)
    : await query;

  if (findError) throw new Error(`Failed to load customer: ${findError.message}`);
  if (existing?.length) {
    const customer = existing[0];
    const { data, error } = await supabase
      .from("customers")
      .update({
        full_name: normalizedName || customer.full_name,
        email: normalizedEmail || customer.email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customer.id)
      .select("id, full_name, phone, email")
      .single();
    if (error) throw new Error(`Failed to update customer: ${error.message}`);
    return data;
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({ full_name: normalizedName, phone: normalizedPhone, email: normalizedEmail })
    .select("id, full_name, phone, email")
    .single();
  if (error) throw new Error(`Failed to create customer: ${error.message}`);
  return data;
}
