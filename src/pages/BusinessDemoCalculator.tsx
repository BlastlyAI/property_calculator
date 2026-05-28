import { useState } from 'react';

const SERVICES = [
  { id: 'house', icon: '🏠', label: 'House Clean', desc: 'Regular or one-off clean' },
  { id: 'deep', icon: '✨', label: 'Deep Clean', desc: 'Full top-to-bottom clean' },
  { id: 'lease', icon: '🔑', label: 'End of Lease', desc: 'Bond clean with guarantee' },
];

export function BusinessDemoCalculator() {
  const [selectedService, setSelectedService] = useState('house');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);

  const basePrice = selectedService === 'house' ? 180 : selectedService === 'deep' ? 320 : 480;
  const bedroomAdj = (bedrooms - 2) * 30;
  const bathroomAdj = (bathrooms - 1) * 25;
  const total = basePrice + bedroomAdj + bathroomAdj;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Branded header — business logo replaces HomeSnap */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Business logo placeholder */}
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #00B5AD, #0D2B4E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff' }}>
            SC
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0D2B4E' }}>Sparkle Clean Co.</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Bondi, NSW · 0412 345 678</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#f59e0b', fontSize: 13 }}>★★★★★</span>
          <span style={{ fontSize: 13, color: '#64748b' }}>4.8 (127)</span>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', margin: 0 }}>
            Get your instant cleaning quote
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: 14 }}>
            Prices are calculated in real time — no waiting, no callbacks
          </p>
        </div>

        {/* Service selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: '0.75rem' }}>What do you need cleaned?</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {SERVICES.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedService(s.id)}
                style={{
                  padding: '1rem 0.5rem',
                  border: selectedService === s.id ? '2px solid #00B5AD' : '2px solid #e2e8f0',
                  borderRadius: 12,
                  background: selectedService === s.id ? '#f0fffe' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 26, marginBottom: '0.35rem' }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: selectedService === s.id ? '#00B5AD' : '#0D2B4E' }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: '0.15rem', lineHeight: 1.3 }}>{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Property details */}
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.07)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0D2B4E', margin: '0 0 1.25rem' }}>Property details</h3>

          {/* Bedrooms */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Bedrooms</label>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>{bedrooms}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5, '6+'].map(n => (
                <button
                  key={n}
                  onClick={() => setBedrooms(typeof n === 'number' ? n : 6)}
                  style={{
                    flex: 1, padding: '0.5rem', border: bedrooms === (typeof n === 'number' ? n : 6) ? '2px solid #00B5AD' : '2px solid #e2e8f0',
                    borderRadius: 8, background: bedrooms === (typeof n === 'number' ? n : 6) ? '#f0fffe' : '#fff',
                    fontSize: 13, fontWeight: 600, color: bedrooms === (typeof n === 'number' ? n : 6) ? '#00B5AD' : '#64748b',
                    cursor: 'pointer', transition: 'all 0.1s',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Bathrooms</label>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>{bathrooms}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setBathrooms(n)}
                  style={{
                    flex: 1, padding: '0.5rem', border: bathrooms === n ? '2px solid #00B5AD' : '2px solid #e2e8f0',
                    borderRadius: 8, background: bathrooms === n ? '#f0fffe' : '#fff',
                    fontSize: 13, fontWeight: 600, color: bathrooms === n ? '#00B5AD' : '#64748b',
                    cursor: 'pointer', transition: 'all 0.1s',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live estimate */}
        <div style={{ background: 'linear-gradient(135deg, #0D2B4E, #1a3f6e)', borderRadius: 16, padding: '1.75rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Your estimated price</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#D4AF37', lineHeight: 1 }}>${total}</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: '0.5rem' }}>
            {bedrooms} bed · {bathrooms} bath · {SERVICES.find(s => s.id === selectedService)?.label}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {['Fully insured', 'Eco products', 'Satisfaction guarantee'].map(tag => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 11, color: '#94a3b8' }}>
                <span style={{ color: '#00B5AD' }}>✓</span> {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Book CTA */}
        <button
          style={{ width: '100%', padding: '1rem', background: '#00B5AD', color: '#fff', border: 'none', borderRadius: 12, fontSize: 17, fontWeight: 700, cursor: 'pointer', marginBottom: '0.75rem' }}
        >
          Book This Clean — ${total}
        </button>
        <button
          style={{ width: '100%', padding: '0.85rem', background: 'transparent', color: '#0D2B4E', border: '2px solid #0D2B4E', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem' }}
        >
          📞 Call Us Instead — 0412 345 678
        </button>

        {/* Powered by badge */}
        <div style={{ textAlign: 'center' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 20, padding: '0.35rem 0.9rem' }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Powered by</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#0D2B4E' }}>Home</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#00B5AD' }}>Snap</span>
          </a>
        </div>
      </div>

      {/* Aria widget placeholder */}
      <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg, #00B5AD, #0D2B4E)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,181,173,0.4)',
        cursor: 'pointer',
        animation: 'pulse 2s infinite',
      }}>
        <style>{`@keyframes pulse { 0%, 100% { box-shadow: 0 4px 20px rgba(0,181,173,0.4); } 50% { box-shadow: 0 4px 32px rgba(0,181,173,0.7); } }`}</style>
        <span style={{ fontSize: 24 }}>💬</span>
      </div>
    </div>
  );
}
