import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AdminUser } from "../types/admin";
import { adminGetSession, adminLogin, adminLogout, clearAdminSession, getAdminToken } from "../services/adminApi";

interface AdminAuthContextShape {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextShape | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoading(false);
      return;
    }
    adminGetSession()
      .then((data) => setUser(data.user))
      .catch(() => {
        clearAdminSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        const loggedInUser = await adminLogin(email, password);
        setUser(loggedInUser);
      },
      logout: async () => {
        await adminLogout();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
