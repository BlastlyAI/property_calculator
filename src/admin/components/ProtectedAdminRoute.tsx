import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../auth/AdminAuthContext";

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdminAuth();
  if (loading) {
    return <div className="admin-root" style={{ padding: "2rem" }}>Loading admin session...</div>;
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
