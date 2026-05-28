import { useEffect, useState } from "react";
import { fetchAnalytics } from "../services/adminApi";

export function AdminAnalytics() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetchAnalytics().then(setData);
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  const topServices = (data.topServices as Array<Record<string, unknown>>) || [];
  const bookingTrend = (data.bookingTrend as Array<{ date: string; count: number }>) || [];
  const maxTrend = Math.max(...bookingTrend.map((d) => d.count), 1);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Analytics</h2>
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Active leads</h3>
          <p>{String((data.leadFunnel as Record<string, unknown>)?.activeLeads || 0)}</p>
        </div>
        <div className="admin-card">
          <h3>Abandonment rate</h3>
          <p>{String((data.leadFunnel as Record<string, unknown>)?.abandonmentRate || 0)}%</p>
        </div>
        <div className="admin-card">
          <h3>Paid bookings</h3>
          <p>{String((data.paymentStats as Record<string, unknown>)?.paid || 0)}</p>
        </div>
        <div className="admin-card">
          <h3>Pending payments</h3>
          <p>{String((data.paymentStats as Record<string, unknown>)?.pending || 0)}</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 14 }}>
        <h3>Top services</h3>
        {topServices.map((service) => (
          <div key={String(service.serviceId)} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>{String(service.serviceId)}</span>
            <span>{String(service.bookings)} bookings · {String(service.conversionPct)}% paid</span>
          </div>
        ))}
      </div>

      <div className="admin-card" style={{ marginTop: 14 }}>
        <h3>Booking trend (14 days)</h3>
        <div className="admin-bar-chart">
          {bookingTrend.map((point) => (
            <div key={point.date} className="admin-bar" style={{ height: `${(point.count / maxTrend) * 100}%` }} title={`${point.date}: ${point.count}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
