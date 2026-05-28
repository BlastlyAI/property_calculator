import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './components/Logo';

const SERVICE_TYPES = [
  { id: 'pool', icon: '🏊', label: 'Pool Cleaning', desc: 'Pool maintenance & water treatment' },
  { id: 'house', icon: '🏠', label: 'House Cleaning', desc: 'Residential & commercial cleaning' },
  { id: 'lawn', icon: '🌿', label: 'Lawn Mowing', desc: 'Lawn care & garden maintenance' },
];

export function BusinessSignup() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    yourName: '',
    email: '',
    phone: '',
    suburb: '',
    state: '',
    gmb: '',
  });

  const handleSetup = () => {
    if (!selectedService) return;
    setShowPayment(true);
    setTimeout(() => {
      document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePay = () => {
    navigate('/business/preview');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <Logo size="md" />
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0D2B4E', lineHeight: 1.3, margin: 0 }}>
            Get your instant quote calculator live in 5 minutes
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.75rem', fontSize: 15 }}>
            No tech skills needed. Your branded calculator is live the moment you pay.
          </p>
        </div>

        {/* Form card */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2rem' }}>

          {/* Business Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Business name</label>
            <input
              type="text"
              placeholder="e.g. Sparkle Clean Co."
              value={form.businessName}
              onChange={e => setForm({ ...form, businessName: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E' }}
            />
          </div>

          {/* Your Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Your name</label>
            <input
              type="text"
              placeholder="e.g. Sarah Johnson"
              value={form.yourName}
              onChange={e => setForm({ ...form, yourName: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E' }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Email address</label>
            <input
              type="email"
              placeholder="sarah@sparkleclean.com.au"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E' }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Phone number</label>
            <input
              type="tel"
              placeholder="0412 345 678"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E' }}
            />
          </div>

          {/* Suburb + State */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Suburb</label>
              <input
                type="text"
                placeholder="e.g. Bondi"
                value={form.suburb}
                onChange={e => setForm({ ...form, suburb: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>State</label>
              <select
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E', background: '#fff' }}
              >
                <option value="">—</option>
                {['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>Service type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {SERVICE_TYPES.map(s => (
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
                  <div style={{ fontSize: 28, marginBottom: '0.4rem' }}>{s.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selectedService === s.id ? '#00B5AD' : '#0D2B4E' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: '0.2rem', lineHeight: 1.3 }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Google My Business */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
              Google My Business name <span style={{ fontWeight: 400, color: '#94a3b8' }}>— optional</span>
            </label>
            <input
              type="text"
              placeholder="We use this to pre-fill your logo and details automatically"
              value={form.gmb}
              onChange={e => setForm({ ...form, gmb: e.target.value })}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#0D2B4E' }}
            />
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSetup}
            style={{
              width: '100%',
              padding: '1rem',
              background: selectedService ? '#00B5AD' : '#94a3b8',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 17,
              fontWeight: 700,
              cursor: selectedService ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            Set Up My Calculator — $149 / month
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: '0.75rem' }}>
            Cancel any time. Your calculator is live the moment you pay. No lock-in contracts.
          </p>
        </div>

        {/* Payment section — appears after clicking CTA */}
        {showPayment && (
          <div id="payment-section" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: '2rem', marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0D2B4E', marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: 20 }}>🔒</span> Secure payment
            </h3>

            {/* Card Number */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Card number</label>
              <div style={{ padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>1234  5678  9012  3456</span>
                <span style={{ fontSize: 20 }}>💳</span>
              </div>
            </div>

            {/* Expiry + CVC */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Expiry</label>
                <div style={{ padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, color: '#94a3b8' }}>MM / YY</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>CVC</label>
                <div style={{ padding: '0.75rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 15, color: '#94a3b8' }}>•••</div>
              </div>
            </div>

            <button
              onClick={handlePay}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#00B5AD',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Pay $149 / month — Launch My Calculator
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: '0.75rem' }}>
              Secured by Stripe. Your card details are never stored on our servers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
