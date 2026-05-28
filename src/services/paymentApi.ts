import type { ApiResponse, PaymentConfirmResult, PaymentSession } from "../types/calculator";

export async function fetchPaymentConfig(): Promise<{ publishableKey: string; currency: string }> {
  const res = await fetch("/api/payments/config");
  const data: ApiResponse<{ publishableKey: string; currency: string }> = await res.json();
  if (!res.ok || !data.success || !data.data) {
    throw new Error(data.error?.message || "Failed to load payment config");
  }
  return data.data;
}

export async function createPaymentIntent(bookingId: string, customerEmail?: string): Promise<PaymentSession> {
  const res = await fetch("/api/payments/create-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId, customerEmail }),
  });
  const data: ApiResponse<PaymentSession> = await res.json();
  if (!res.ok || !data.success || !data.data) {
    throw new Error(data.error?.message || "Failed to start payment");
  }
  return data.data;
}

export async function confirmPayment(bookingId: string, paymentIntentId: string): Promise<PaymentConfirmResult> {
  const res = await fetch("/api/payments/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId, paymentIntentId }),
  });
  const data: ApiResponse<PaymentConfirmResult> = await res.json();
  if (!res.ok || !data.success || !data.data) {
    throw new Error(data.error?.message || "Failed to confirm payment");
  }
  return data.data;
}
