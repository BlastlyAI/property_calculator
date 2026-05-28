import { useEffect, useState } from "react";
import { fetchCustomerDetail, fetchCustomers } from "../services/adminApi";

export function AdminCustomers() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);

  const load = async () => {
    const result = await fetchCustomers({ search, page, pageSize: 15 });
    setItems(result.items);
    setTotalPages(result.pagination.totalPages);
  };

  useEffect(() => { load(); }, [search, page]);

  useEffect(() => {
    if (!selectedId) return;
    fetchCustomerDetail(selectedId).then(setDetail).catch(() => setDetail(null));
  }, [selectedId]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Customers</h2>
      <div className="admin-toolbar">
        <input className="admin-input" placeholder="Search name/phone/email..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Email</th><th>Bookings</th><th>Total spend</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={String(row.id)}>
                <td>{String(row.full_name || "—")}</td>
                <td>{String(row.phone || "—")}</td>
                <td>{String(row.email || "—")}</td>
                <td>{String(row.bookingCount || 0)}</td>
                <td>${String(row.totalSpendAud || 0)}</td>
                <td><button className="admin-btn ghost" onClick={() => setSelectedId(String(row.id))}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button className="admin-btn ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button className="admin-btn ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {detail && (
        <div className="admin-card" style={{ marginTop: 16 }}>
          <h3>Customer detail</h3>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(detail, null, 2)}</pre>
          <button className="admin-btn ghost" onClick={() => { setSelectedId(null); setDetail(null); }}>Close</button>
        </div>
      )}
    </div>
  );
}
