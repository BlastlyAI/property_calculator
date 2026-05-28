import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AdminAuthContext";
import "../styles/admin.css";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/leads", label: "Leads" },
  { to: "/admin/analytics", label: "Analytics" },
  { to: "/admin/settings", label: "Settings" },
];

export function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">HomeSnap Admin</div>
          <nav className="admin-nav">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Signed in as</div>
              <div style={{ fontWeight: 700 }}>{user?.fullName || user?.email}</div>
            </div>
            <button
              className="admin-btn ghost"
              onClick={async () => {
                await logout();
                navigate("/admin/login");
              }}
            >
              Logout
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
