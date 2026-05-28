import { useEffect, useState } from "react";
import { fetchDashboard } from "../services/adminApi";
import type { DashboardOverview } from "../types/admin";

export function AdminDashboard() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard"));
  }, []);

  if (error) return <p style={{ color: "#b91c1c" }}>{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  const cards = [
    { label: "Total bookings", value: data.totals.bookings },
    { label: "Paid bookings", value: data.totals.paidBookings },
    { label: "Pending bookings", value: data.totals.pendingBookings },
    { label: "Total customers", value: data.totals.customers },
    { label: "Quotes generated", value: data.totals.quotes },
    { label: "Active leads", value: data.totals.leads },
    { label: "Today bookings", value: data.periods.todayBookings },
    { label: "Week bookings", value: data.periods.weekBookings },
    { label: "Month bookings", value: data.periods.monthBookings },
    { label: "Conversion rate", value: `${data.rates.conversionRate}%` },
    { label: "Payment success", value: `${data.rates.paymentSuccessRate}%` },
    { label: "Quote → booking", value: `${data.rates.quoteToBookingRate}%` },
  ];

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Dashboard Overview</h2>
      <div className="admin-grid">
        {cards.map((card) => (
          <div className="admin-card" key={card.label}>
            <h3>{card.label}</h3>
            <p>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
