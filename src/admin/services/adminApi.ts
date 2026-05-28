import type { ApiResponse } from "../../types/calculator";
import type { AdminSession, AdminUser, BookingRow, DashboardOverview, Paginated } from "../types/admin";

const SESSION_KEY = "homesnap.admin.session";

export function getAdminToken() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AdminSession;
    return parsed.accessToken || null;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(SESSION_KEY);
}

async function adminFetch<T>(path: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`/api/admin${path}`, { ...options, headers });
  const data: ApiResponse<T> = await res.json();
  if (!res.ok || !data.success || data.data === undefined) {
    throw new Error(data.error?.message || "Admin request failed");
  }
  return data.data;
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data: ApiResponse<{ user: AdminUser; session: AdminSession }> = await res.json();
  if (!res.ok || !data.success || !data.data) {
    throw new Error(data.error?.message || "Login failed");
  }
  saveAdminSession({
    accessToken: data.data.session.accessToken,
    refreshToken: data.data.session.refreshToken,
    expiresAt: data.data.session.expiresAt,
  });
  return data.data.user;
}

export async function adminLogout() {
  try {
    await adminFetch("/auth/logout", { method: "POST" });
  } finally {
    clearAdminSession();
  }
}

export async function adminGetSession() {
  return adminFetch<{ user: AdminUser }>("/auth/session");
}

export async function fetchDashboard() {
  return adminFetch<DashboardOverview>("/dashboard");
}

export async function fetchBookings(params: Record<string, string | number>) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return adminFetch<Paginated<BookingRow>>(`/bookings?${query}`);
}

export async function patchBooking(bookingId: string, body: { status?: string; paymentStatus?: string }) {
  return adminFetch<{ booking: BookingRow }>(`/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function fetchCustomers(params: Record<string, string | number>) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return adminFetch<Paginated<Record<string, unknown>>>(`/customers?${query}`);
}

export async function fetchCustomerDetail(customerId: string) {
  return adminFetch<Record<string, unknown>>(`/customers/${customerId}`);
}

export async function fetchLeads(params: Record<string, string | number>) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return adminFetch<Paginated<Record<string, unknown>>>(`/leads?${query}`);
}

export async function fetchAnalytics() {
  return adminFetch<Record<string, unknown>>("/analytics");
}
