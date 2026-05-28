import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './components/Logo';

export function BusinessPreview() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'loading' | 'found'>('loading');
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState({
    businessName: 'Sparkle Clean Co.',
    phone: '0412 345 678',
    suburb: 'Bondi, NSW',
    rating: '4.8',
    reviews: '127',
    service: 'House Cleaning',
  });

  useEffect(() => {
    const t = setTimeout(() => setPhase('found'), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <Logo size="md" />
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0D2B4E', margin: 0 }}>
            Here is what we found about your business
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: 15 }}>
            We pulled this from Google My Business automatically
          </p>
        </div>

        {phase === 'loading' ? (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '4px solid #e2e8f0', borderTopColor: '#00B5AD',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>Looking up your business details…</p>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: '0.5rem' }}>Checking Google My Business, reviews, and contact info</p>
          </div>
        ) : (
          <>
            {/* Business card */}
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {/* Logo placeholder */}
                <div style={{
                  width: 72, height: 72, borderRadius: 16,
                  background: 'linear-gradient(135deg, #00B5AD, #0D2B4E)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  SC
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#0D2B4E' }}>{details.businessName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                    <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(5)}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0D2B4E' }}>{details.rating}</span>
                    <span style={{ fontSize: 13, color: '#64748b' }}>({details.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { label: 'Phone', value: details.phone, icon: '📞' },
                  { label: 'Location', value: details.suburb, icon: '📍' },
                  { label: 'Service', value: details.service, icon: '✅' },
                  { label: 'Status', value: 'Verified on Google', icon: '🏅' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem 1rem' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0D2B4E', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>{item.icon}</span> {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit section */}
            {editing && (
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '1.5rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0D2B4E', marginTop: 0, marginBottom: '1rem' }}>Edit your details</h3>
                {Object.entries(details).map(([key, val]) => (
                  <div key={key} style={{ marginBottom: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: '0.3rem', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="text"
                      value={val}
                      onChange={e => setDetails({ ...details, [key]: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E' }}
                    />
                  </div>
                ))}
                <button
                  onClick={() => setEditing(false)}
                  style={{ padding: '0.6rem 1.25rem', background: '#0D2B4E', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Save changes
                </button>
              </div>
            )}

            {/* CTAs */}
            <button
              onClick={() => navigate('/business/success')}
              style={{
                width: '100%', padding: '1rem',
                background: '#00B5AD', color: '#fff',
                border: 'none', borderRadius: 12,
                fontSize: 17, fontWeight: 700, cursor: 'pointer', marginBottom: '0.75rem',
              }}
            >
              This looks right — Launch My Calculator
            </button>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', color: '#00B5AD', fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                I need to change something
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
