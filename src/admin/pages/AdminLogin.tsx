import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AdminAuthContext";
import "../styles/admin.css";

export function AdminLogin() {
  const { user, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1 style={{ margin: 0, fontSize: 24, color: "#0D2B4E" }}>Admin Login</h1>
        <p style={{ color: "#6b7280", marginTop: 8, marginBottom: 20 }}>
          Secure access to HomeSnap operations dashboard
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              setError(null);
              await login(email.trim(), password);
              navigate("/admin/dashboard");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Login failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Email</label>
          <input className="admin-input" style={{ width: "100%", marginBottom: 12 }} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          <label style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Password</label>
          <input className="admin-input" style={{ width: "100%", marginBottom: 12 }} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          {error && <p style={{ color: "#b91c1c", fontSize: 13 }}>{error}</p>}
          <button className="admin-btn primary" style={{ width: "100%", marginTop: 8 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
