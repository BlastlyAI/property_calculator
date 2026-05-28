export function AdminSettings() {
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Settings</h2>
      <div className="admin-card">
        <h3>Admin access setup</h3>
        <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.5 }}>
          1. Create an admin user in Supabase Auth (email/password).<br />
          2. Run migration <code>003_admin_leads.sql</code>.<br />
          3. Add your email to <code>ADMIN_EMAIL_ALLOWLIST</code> in <code>.env.local</code> (comma-separated), or insert into <code>admin_users</code> table.<br />
          4. Optional: set user metadata role to <code>admin</code> in Supabase Auth.
        </p>
      </div>
    </div>
  );
}
