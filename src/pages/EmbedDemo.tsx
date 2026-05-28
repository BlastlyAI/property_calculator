import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Star, MapPin, ChevronRight, CheckCircle, X } from 'lucide-react';

// The embedded HomeSnap widget as it appears on a third-party cleaning website
function HomeSnapWidget({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'idle' | 'address' | 'service' | 'result'>('idle');
  const [address, setAddress] = useState('');
  const [service, setService] = useState<string | null>(null);

  if (step === 'idle') {
    return (
      <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.15)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        {/* Widget header */}
        <div style={{ background: 'linear-gradient(135deg, #0E7C7B, #0a6160)', padding: '1.25rem 1.25rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', padding: '0.375rem' }}>
                <span style={{ fontSize: 18 }}>🧹</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>Get an instant quote</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Powered by HomeSnap</div>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        </div>
        {/* Widget body */}
        <div style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: '1rem', lineHeight: 1.5 }}>
            Find out what your clean will cost in under 60 seconds. No calls. No waiting.
          </p>
          <button
            onClick={() => setStep('address')}
            style={{ width: '100%', padding: '0.875rem', background: '#0E7C7B', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Get My Quote <ChevronRight size={16} />
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '0.875rem' }}>
            {['No obligation', 'Instant estimate', 'Book in one tap'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 11, color: '#9ca3af' }}>
                <CheckCircle size={11} color="#0E7C7B" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'address') {
    return (
      <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.15)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <div style={{ background: 'linear-gradient(135deg, #0E7C7B, #0a6160)', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>Step 1 of 3 — Your address</div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {[1, 2, 3].map(i => <div key={i} style={{ width: 20, height: 3, borderRadius: 2, background: i === 1 ? 'white' : 'rgba(255,255,255,0.3)' }} />)}
            </div>
          </div>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <MapPin size={16} color="#0E7C7B" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter your address..."
              style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', border: '2px solid #e5e7eb', borderRadius: '0.75rem', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#0E7C7B'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          {/* Suggestion */}
          {address.length > 2 && (
            <div style={{ background: '#f8fffe', borderRadius: '0.625rem', padding: '0.625rem 0.75rem', marginBottom: '1rem', border: '1px solid #e0f2f1', cursor: 'pointer' }} onClick={() => { setAddress('12 Maple Street, Surry Hills NSW 2010'); }}>
              <div style={{ fontSize: 12, color: '#0E7C7B', fontWeight: 600, marginBottom: '0.125rem' }}>📍 Suggested</div>
              <div style={{ fontSize: 13, color: '#0D2B4E' }}>12 Maple Street, Surry Hills NSW 2010</div>
            </div>
          )}
          <button
            onClick={() => setStep('service')}
            disabled={address.length < 5}
            style={{ width: '100%', padding: '0.75rem', background: address.length >= 5 ? '#0E7C7B' : '#e5e7eb', color: address.length >= 5 ? 'white' : '#9ca3af', border: 'none', borderRadius: '0.75rem', fontSize: 14, fontWeight: 700, cursor: address.length >= 5 ? 'pointer' : 'not-allowed', fontFamily: 'DM Sans, sans-serif' }}>
            Next <ChevronRight size={14} style={{ display: 'inline' }} />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'service') {
    return (
      <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.15)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <div style={{ background: 'linear-gradient(135deg, #0E7C7B, #0a6160)', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>Step 2 of 3 — Service</div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {[1, 2, 3].map(i => <div key={i} style={{ width: 20, height: 3, borderRadius: 2, background: i <= 2 ? 'white' : 'rgba(255,255,255,0.3)' }} />)}
            </div>
          </div>
        </div>
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {[
              { id: 'house', icon: '🧹', label: 'House Cleaning', from: 'From $120' },
              { id: 'carpet', icon: '🏠', label: 'Carpet Cleaning', from: 'From $80' },
              { id: 'windows', icon: '🪟', label: 'Window Cleaning', from: 'From $95' },
            ].map(s => (
              <button key={s.id} onClick={() => setService(s.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', border: service === s.id ? '2px solid #0E7C7B' : '2px solid #e5e7eb', background: service === s.id ? '#f0fafa' : 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#0D2B4E', textAlign: 'left' }}>{s.label}</span>
                <span style={{ fontSize: 12, color: '#0E7C7B', fontWeight: 600 }}>{s.from}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep('result')}
            disabled={!service}
            style={{ width: '100%', padding: '0.75rem', background: service ? '#0E7C7B' : '#e5e7eb', color: service ? 'white' : '#9ca3af', border: 'none', borderRadius: '0.75rem', fontSize: 14, fontWeight: 700, cursor: service ? 'pointer' : 'not-allowed', fontFamily: 'DM Sans, sans-serif' }}>
            Get My Estimate <ChevronRight size={14} style={{ display: 'inline' }} />
          </button>
        </div>
      </div>
    );
  }

  // Result
  return (
    <div style={{ background: 'white', borderRadius: '1.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.15)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <div style={{ background: 'linear-gradient(135deg, #0D2B4E, #0a3d5c)', padding: '1.25rem' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Your estimate</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: '#C8922A' }}>$150 — $185</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>House cleaning · 3 bed · Surry Hills</div>
      </div>
      <div style={{ padding: '1.25rem' }}>
        <button
          onClick={() => navigate('/calculator/5')}
          style={{ width: '100%', padding: '0.875rem', background: '#C8922A', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginBottom: '0.625rem' }}>
          Book Now <ChevronRight size={16} style={{ display: 'inline' }} />
        </button>
        <button
          style={{ width: '100%', padding: '0.75rem', background: 'white', color: '#374151', border: '2px solid #e5e7eb', borderRadius: '0.75rem', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          Email me this quote
        </button>
        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: 11, color: '#9ca3af' }}>
          Powered by <a href="/" style={{ color: '#0E7C7B', textDecoration: 'none', fontWeight: 600 }}>HomeSnap</a>
        </div>
      </div>
    </div>
  );
}

export function EmbedDemo() {
  const navigate = useNavigate();
  const [showWidget, setShowWidget] = useState(false);

  return (
    <div style={{ fontFamily: 'DM Sans, Inter, sans-serif', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Mock cleaning business website nav */}
      <nav style={{ background: '#1a1a2e', padding: '0 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '0.625rem', background: '#0E7C7B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧹</div>
            <div>
              <div style={{ fontWeight: 800, color: 'white', fontSize: 16 }}>Sparkle Clean Co.</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Sydney's trusted cleaners</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {['Services', 'About', 'Reviews', 'Contact'].map(l => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>{l}</a>
            ))}
            <button style={{ background: '#0E7C7B', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {/* Mock hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '4rem 2rem', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: '1rem' }}>
            Professional Home Cleaning in Sydney
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: '2rem' }}>
            Trusted by 2,400+ Sydney families. Fully insured. 100% satisfaction guaranteed.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#C8922A" color="#C8922A" />)}
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginLeft: '0.375rem' }}>4.9 · 847 reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>
        {/* Left — mock page content */}
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0D2B4E', marginBottom: '1.5rem' }}>Our Services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { icon: '🧹', title: 'Regular Cleaning', desc: 'Weekly, fortnightly, or monthly. Consistent quality every time.' },
              { icon: '💪', title: 'Deep Cleaning', desc: 'Top to bottom. Perfect for spring cleans or before/after events.' },
              { icon: '🏠', title: 'End of Lease', desc: 'Bond-back guaranteed. We know what agents look for.' },
              { icon: '🏢', title: 'Commercial', desc: 'Offices, retail, and commercial spaces. Flexible scheduling.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 28, marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontWeight: 700, color: '#0D2B4E', marginBottom: '0.375rem' }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D2B4E', marginBottom: '1rem' }}>What our customers say</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Sarah M.', suburb: 'Surry Hills', text: 'Absolutely amazing. The team was on time, professional, and my apartment has never looked better.' },
              { name: 'James T.', suburb: 'Newtown', text: 'Used them for end of lease. Got my full bond back. Couldn\'t be happier.' },
            ].map((r, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '0.875rem', padding: '1rem', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#C8922A" color="#C8922A" />)}
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, marginBottom: '0.5rem' }}>"{r.text}"</p>
                <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>{r.name} · {r.suburb}</div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e5e7eb', marginTop: '1.5rem', display: 'flex', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 14, color: '#374151' }}>
              <Phone size={16} color="#0E7C7B" />
              <a href="tel:0412345678" style={{ color: '#0D2B4E', textDecoration: 'none', fontWeight: 600 }}>0412 345 678</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 14, color: '#374151' }}>
              <Mail size={16} color="#0E7C7B" />
              <a href="mailto:hello@sparkleclean.com.au" style={{ color: '#0D2B4E', textDecoration: 'none', fontWeight: 600 }}>hello@sparkleclean.com.au</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 14, color: '#374151' }}>
              <MapPin size={16} color="#0E7C7B" />
              <span>Sydney, NSW</span>
            </div>
          </div>
        </div>

        {/* Right — HomeSnap widget embedded */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          <div style={{ background: '#f0fafa', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid #c6e9e9' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0E7C7B', textAlign: 'center' }}>
              ⚡ Get an instant quote below — no phone call needed
            </div>
          </div>
          <HomeSnapWidget />
          <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: 11, color: '#9ca3af' }}>
            This widget is embedded on Sparkle Clean Co.'s website.<br />
            <a href="/" style={{ color: '#0E7C7B', textDecoration: 'none' }}>Add HomeSnap to your website →</a>
          </div>
        </div>
      </div>

      {/* Explanation banner at bottom */}
      <div style={{ background: '#0D2B4E', padding: '2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0E7C7B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Design preview note
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 1.6, marginBottom: '1rem' }}>
            This page shows how the HomeSnap quote widget looks when embedded on a cleaning business website. The widget above is fully interactive — try entering an address and selecting a service.
          </p>
          <button onClick={() => navigate('/')} style={{ background: '#0E7C7B', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.75rem 1.5rem', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            ← Back to HomeSnap
          </button>
        </div>
      </div>
    </div>
  );
}
