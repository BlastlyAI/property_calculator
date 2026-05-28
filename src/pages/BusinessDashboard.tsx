import { useState } from 'react';
import { Logo } from './components/Logo';

const LEADS = [
  { date: '27 May', name: 'Emma Wilson', suburb: 'Bondi', service: 'House Clean', quote: '$280', phone: '0411 222 333', status: 'New' },
  { date: '26 May', name: 'James Nguyen', suburb: 'Coogee', service: 'Deep Clean', quote: '$420', phone: '0422 444 555', status: 'Contacted' },
  { date: '25 May', name: 'Sophie Chen', suburb: 'Randwick', service: 'House Clean', quote: '$260', phone: '0433 666 777', status: 'Contacted' },
  { date: '24 May', name: 'Tom Baker', suburb: 'Maroubra', service: 'End of Lease', quote: '$580', phone: '0444 888 999', status: 'New' },
  { date: '23 May', name: 'Priya Sharma', suburb: 'Bronte', service: 'House Clean', quote: '$240', phone: '0455 111 222', status: 'Contacted' },
];

const BUSINESS_SLUG = 'sparkle-clean-co';
const CALC_URL = `homesnap.house/${BUSINESS_SLUG}`;
const EMBED_CODE = `<script src="https://homesnap.house/embed.js" data-business="${BUSINESS_SLUG}"></script>`;

export function BusinessDashboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'settings' | 'account'>('leads');

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Upgrade banner */}
      <div style={{ background: 'linear-gradient(90deg, #D4AF37, #f0c040)', padding: '0.6rem 1.5rem', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#0D2B4E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <span>⭐ Upgrade to Pro for real estate alerts and priority placement</span>
        <button style={{ background: '#0D2B4E', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.9rem', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Upgrade</button>
      </div>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Business info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #00B5AD, #0D2B4E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>SC</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D2B4E' }}>Sparkle Clean Co.</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ background: '#f0fffe', color: '#00B5AD', fontSize: 11, fontWeight: 600, padding: '0.1rem 0.5rem', borderRadius: 20, border: '1px solid #00B5AD' }}>House Cleaning</span>
                <span style={{ color: '#f59e0b', fontSize: 12 }}>★ 4.8</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>(127)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total quotes this month', value: '47', icon: '📊', trend: '+12 vs last month' },
            { label: 'Leads captured', value: '18', icon: '📥', trend: '+5 vs last month' },
            { label: 'Calculator views', value: '312', icon: '👁️', trend: '+64 vs last month' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#fff', borderRadius: 14, padding: '1.25rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 22, marginBottom: '0.4rem' }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0D2B4E' }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: '0.2rem' }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: '#00B5AD', fontWeight: 600, marginTop: '0.4rem' }}>{stat.trend}</div>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { key: 'leads', label: '📋 Recent Leads' },
            { key: 'settings', label: '⚙️ Calculator Settings' },
            { key: 'account', label: '👤 Account' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              style={{
                padding: '0.6rem 1.1rem',
                border: 'none',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                background: activeTab === tab.key ? '#0D2B4E' : '#fff',
                color: activeTab === tab.key ? '#fff' : '#64748b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leads table */}
        {activeTab === 'leads' && (
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>Recent Leads</h3>
              <span style={{ fontSize: 12, color: '#64748b' }}>May 2026</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Date', 'Customer', 'Suburb', 'Service', 'Quote', 'Phone', 'Status'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEADS.map((lead, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.9rem 1rem', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{lead.date}</td>
                      <td style={{ padding: '0.9rem 1rem', fontSize: 14, fontWeight: 600, color: '#0D2B4E', whiteSpace: 'nowrap' }}>{lead.name}</td>
                      <td style={{ padding: '0.9rem 1rem', fontSize: 13, color: '#64748b' }}>{lead.suburb}</td>
                      <td style={{ padding: '0.9rem 1rem', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{lead.service}</td>
                      <td style={{ padding: '0.9rem 1rem', fontSize: 14, fontWeight: 700, color: '#0D2B4E' }}>{lead.quote}</td>
                      <td style={{ padding: '0.9rem 1rem', fontSize: 13, color: '#00B5AD', fontWeight: 600, whiteSpace: 'nowrap' }}>{lead.phone}</td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 20,
                          background: lead.status === 'New' ? '#fef3c7' : '#f0fffe',
                          color: lead.status === 'New' ? '#d97706' : '#00B5AD',
                        }}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calculator settings */}
        {activeTab === 'settings' && (
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>Calculator Settings</h3>

            {[
              { label: 'Your Calculator URL', value: CALC_URL, key: 'url', icon: '🔗' },
              { label: 'Embed Code', value: EMBED_CODE, key: 'embed', icon: '💻', mono: true },
            ].map(item => (
              <div key={item.key}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                  <span>{item.icon}</span> {item.label}
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: '0.75rem 1rem', fontFamily: item.mono ? 'monospace' : 'inherit', fontSize: item.mono ? 12 : 14, color: '#0D2B4E', wordBreak: 'break-all', lineHeight: 1.6 }}>
                    {item.value}
                  </div>
                  <button
                    onClick={() => handleCopy(item.value, item.key)}
                    style={{ padding: '0.75rem 1rem', background: copied === item.key ? '#00B5AD' : '#0D2B4E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s' }}
                  >
                    {copied === item.key ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}

            {/* QR */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                📱 Your QR Code
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://${CALC_URL}&color=0D2B4E`}
                  alt="QR"
                  style={{ width: 120, height: 120, borderRadius: 8 }}
                />
                <div>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 0.75rem', lineHeight: 1.5 }}>Print this on business cards, flyers, and van signage.</p>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://${CALC_URL}&color=0D2B4E`;
                      link.download = 'homesnap-qr.png';
                      link.click();
                    }}
                    style={{ padding: '0.6rem 1.1rem', background: '#0D2B4E', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account settings */}
        {activeTab === 'account' && (
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>Account Settings</h3>

            {[
              { label: 'Email address', value: 'sarah@sparkleclean.com.au', type: 'email' },
              { label: 'Password', value: '••••••••••', type: 'password' },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>{field.label}</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    style={{ flex: 1, padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', color: '#0D2B4E' }}
                  />
                  <button style={{ padding: '0.7rem 1rem', background: '#f8fafc', color: '#0D2B4E', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Change
                  </button>
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0D2B4E' }}>Subscription</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>Starter — $149/month · Renews 27 Jun 2026</div>
                </div>
                <button style={{ padding: '0.6rem 1rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Cancel subscription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
