import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './components/Logo';
import { Calendar, MessageSquare, Share2, Home } from 'lucide-react';
import { useCalculator } from '../state/calculatorContext';

export function CalcConfirm() {
  const navigate = useNavigate();
  const { selectedService, propertyData, quote } = useCalculator();
  const [tick, setTick] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setTick(true), 400);
    const t2 = setTimeout(() => setShowContent(true), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D2B4E 0%, #0a3d5c 100%)', fontFamily: 'DM Sans, Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      {/* Logo */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Logo size="md" variant="white" />
      </div>

      {/* Animated checkmark */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        {/* Outer ring pulse */}
        <div style={{
          position: 'absolute', inset: -16, borderRadius: '50%',
          background: 'rgba(14,124,123,0.15)',
          animation: tick ? 'pulse-ring 1.5s ease-out infinite' : 'none',
        }} />
        {/* Circle */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: tick ? 'linear-gradient(135deg, #0E7C7B, #0a6160)' : 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `4px solid ${tick ? '#0E7C7B' : 'rgba(255,255,255,0.2)'}`,
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: tick ? 'scale(1)' : 'scale(0.8)',
          boxShadow: tick ? '0 0 40px rgba(14,124,123,0.4)' : 'none',
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M12 24L20 32L36 16"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="40"
              strokeDashoffset={tick ? 0 : 40}
              style={{ transition: 'stroke-dashoffset 0.5s ease 0.3s' }}
            />
          </svg>
        </div>
      </div>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: '0.625rem' }}>
          Booking request sent! 🎉
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
          We've sent your request to local cleaners.<br />
          You'll hear back within 2 hours.
        </p>
      </div>

      {showContent && (
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: 420 }}>
          {/* Booking card */}
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Your booking
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { icon: '🧹', label: 'Service', value: `${selectedService || 'house'} cleaning` },
                { icon: '📍', label: 'Address', value: propertyData?.formattedAddress || 'Selected address' },
                { icon: '💰', label: 'Estimate', value: `$${quote?.low || 150}-${quote?.high || 185}` },
                { icon: '📅', label: 'Requested', value: 'Thursday 29 May, 9:00 AM' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{row.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{row.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What happens next */}
          <div style={{ background: 'rgba(14,124,123,0.15)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(14,124,123,0.3)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0E7C7B', marginBottom: '0.75rem' }}>What happens next</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { icon: <MessageSquare size={14} />, text: 'You\'ll get an SMS confirmation within minutes' },
                { icon: <Calendar size={14} />, text: 'A cleaner will confirm your booking within 2 hours' },
                { icon: '✨', text: 'Your home gets cleaned. Done.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                  <span style={{ color: '#0E7C7B', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', border: 'none', background: '#C8922A', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Share2 size={16} /> Share HomeSnap with a friend
            </button>
            <button onClick={() => navigate('/')} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', border: '2px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Home size={16} /> Back to HomeSnap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
