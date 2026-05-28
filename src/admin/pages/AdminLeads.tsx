import { useEffect, useState } from "react";
import { fetchLeads } from "../services/adminApi";

export function AdminLeads() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeads({ search, status, page, pageSize: 20 }).then((result) => {
      setItems(result.items);
      setTotalPages(result.pagination.totalPages);
    });
  }, [search, status, page]);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Leads & Abandoned Users</h2>
      <div className="admin-toolbar">
        <input className="admin-input" placeholder="Search address/service..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
        <select className="admin-select" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="active">Active (abandoned)</option>
          <option value="converted">Converted</option>
          <option value="">All</option>
        </select>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Service</th>
              <th>Quote</th>
              <th>Step</th>
              <th>Progress</th>
              <th>Last active</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={String(row.id)}>
                <td style={{ whiteSpace: "normal", minWidth: 220 }}>{String(row.formatted_address || "—")}</td>
                <td>{String(row.service_id || "—")}</td>
                <td>{row.quote_low ? `$${row.quote_low}-${row.quote_high}` : "—"}</td>
                <td>{String(row.progress_step || "—")}</td>
                <td>{String(row.progress_label || "—")}</td>
                <td>{row.last_active_at ? new Date(String(row.last_active_at)).toLocaleString() : "—"}</td>
                <td>{String(row.status || "—")}</td>
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
    </div>
  );
}
