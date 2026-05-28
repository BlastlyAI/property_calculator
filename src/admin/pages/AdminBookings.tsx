import { useEffect, useState } from "react";
import { fetchBookings, patchBooking } from "../services/adminApi";
import type { BookingRow } from "../types/admin";

export function AdminBookings() {
  const [items, setItems] = useState<BookingRow[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<BookingRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const result = await fetchBookings({ search, status, paymentStatus, page, pageSize: 15 });
      setItems(result.items);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    }
  };

  useEffect(() => {
    load();
  }, [search, status, paymentStatus, page]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Bookings</h2>
      <div className="admin-toolbar">
        <input className="admin-input" placeholder="Search reference/service..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
        <select className="admin-select" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">All statuses</option>
          <option value="pending_payment">pending_payment</option>
          <option value="confirmed">confirmed</option>
          <option value="requested">requested</option>
        </select>
        <select className="admin-select" value={paymentStatus} onChange={(e) => { setPage(1); setPaymentStatus(e.target.value); }}>
          <option value="">All payments</option>
          <option value="paid">paid</option>
          <option value="pending">pending</option>
          <option value="failed">failed</option>
        </select>
        <button className="admin-btn ghost" onClick={load}>Refresh</button>
      </div>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td>{row.booking_reference}</td>
                <td>{row.customers?.full_name || "—"}<br /><span style={{ color: "#6b7280" }}>{row.customers?.phone}</span></td>
                <td>{row.service_id}</td>
                <td>{row.status}</td>
                <td><span className={`admin-badge ${row.payment_status}`}>{row.payment_status}</span></td>
                <td>{row.payment_amount ? `$${(row.payment_amount / 100).toFixed(0)}` : "—"}</td>
                <td>{row.booking_date} {row.booking_time}</td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
                <td><button className="admin-btn ghost" onClick={() => setSelected(row)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button className="admin-btn ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span style={{ alignSelf: "center" }}>Page {page} / {totalPages}</span>
        <button className="admin-btn ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "grid", placeItems: "center", zIndex: 50 }} onClick={() => setSelected(null)}>
          <div className="admin-card" style={{ width: "min(560px, 92vw)" }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Booking {selected.booking_reference}</h3>
            <p><strong>Address:</strong> {selected.properties?.formatted_address}</p>
            <p><strong>Email:</strong> {selected.customers?.email || "—"}</p>
            <p><strong>Stripe PI:</strong> {selected.stripe_payment_intent_id || "—"}</p>
            <p><strong>Paid at:</strong> {selected.paid_at ? new Date(selected.paid_at).toLocaleString() : "—"}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="admin-btn primary" onClick={async () => {
                await patchBooking(selected.id, { status: "confirmed", paymentStatus: "paid" });
                setSelected(null);
                load();
              }}>Mark confirmed</button>
              <button className="admin-btn ghost" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
