import { useState } from 'react';
import { Logo } from './components/Logo';

const STYLE_OPTIONS = [
  { id: 'clean', label: 'Clean & Professional', desc: 'Minimal, modern, trust-building', icon: '🏛️' },
  { id: 'bold', label: 'Bold & Modern', desc: 'High contrast, energetic, standout', icon: '⚡' },
  { id: 'warm', label: 'Warm & Friendly', desc: 'Approachable, local, community feel', icon: '🌿' },
];

export function BusinessUpsell() {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: 'Sparkle Clean Co.',
    phone: '0412 345 678',
    suburb: 'Bondi, NSW',
    service: 'House Cleaning',
    facebook: '',
    instagram: '',
  });

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ fontSize: 64, marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0D2B4E', textAlign: 'center', margin: '0 0 0.75rem' }}>Your website is being built</h2>
        <p style={{ color: '#64748b', textAlign: 'center', fontSize: 15, maxWidth: 380, lineHeight: 1.6 }}>
          Your website and social media will be ready within 24 hours. We will send you an email when it is live.
        </p>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: '1rem' }}>Powered by Blastly</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <Logo size="md" />
      </div>

      <div style={{ maxWidth: 540, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-block', background: '#f0fffe', border: '1px solid #00B5AD', borderRadius: 20, padding: '0.3rem 1rem', fontSize: 12, fontWeight: 600, color: '#00B5AD', marginBottom: '0.75rem' }}>
            FREE — included with your plan
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0D2B4E', margin: 0 }}>
            Your free website is almost ready
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: 15 }}>
            We have pre-filled everything we know. Just confirm and choose your style.
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2rem' }}>

          {/* Pre-filled fields */}
          {[
            { key: 'businessName', label: 'Business name' },
            { key: 'phone', label: 'Phone number' },
            { key: 'suburb', label: 'Suburb' },
            { key: 'service', label: 'Service type' },
          ].map(({ key, label }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>{label}</label>
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #00B5AD', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E', background: '#f0fffe' }}
              />
            </div>
          ))}

          {/* Website style */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>Website style preference</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {STYLE_OPTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyle(s.id)}
                  style={{
                    padding: '1rem 0.5rem',
                    border: selectedStyle === s.id ? '2px solid #00B5AD' : '2px solid #e2e8f0',
                    borderRadius: 12,
                    background: selectedStyle === s.id ? '#f0fffe' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: '0.4rem' }}>{s.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: selectedStyle === s.id ? '#00B5AD' : '#0D2B4E', lineHeight: 1.3 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: '0.2rem', lineHeight: 1.3 }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Social handles */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>
              Facebook page URL <span style={{ fontWeight: 400, color: '#94a3b8' }}>— optional</span>
            </label>
            <input
              type="url"
              placeholder="https://facebook.com/yourpage"
              value={form.facebook}
              onChange={e => setForm({ ...form, facebook: e.target.value })}
              style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E' }}
            />
          </div>
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>
              Instagram handle <span style={{ fontWeight: 400, color: '#94a3b8' }}>— optional</span>
            </label>
            <input
              type="text"
              placeholder="@yourhandle"
              value={form.instagram}
              onChange={e => setForm({ ...form, instagram: e.target.value })}
              style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E' }}
            />
          </div>

          <button
            onClick={() => setSubmitted(true)}
            style={{
              width: '100%', padding: '1rem',
              background: '#00B5AD', color: '#fff',
              border: 'none', borderRadius: 12,
              fontSize: 17, fontWeight: 700, cursor: 'pointer', marginBottom: '0.75rem',
            }}
          >
            Build My Free Website
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', margin: 0 }}>
            Your website and social media will be ready within 24 hours. Powered by Blastly.
          </p>
        </div>
      </div>
    </div>
  );
}
