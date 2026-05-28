import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalculatorShell } from './components/CalculatorShell';
import { ChevronRight, Mail, Share2, Star } from 'lucide-react';
import { useCalculator } from '../state/calculatorContext';
import { fetchQuote } from '../services/propertyApi';

export function CalcScreen4() {
  const navigate = useNavigate();
  const { selectedService, propertyData, answers, quote, setQuote } = useCalculator();
  const [revealed, setRevealed] = useState(false);
  const [counting, setCounting] = useState(0);
  const targetLow = quote?.low || 150;
  const targetHigh = quote?.high || 185;

  useEffect(() => {
    if (!selectedService || !propertyData) {
      navigate('/calculator/1');
      return;
    }
    (async () => {
      try {
        const nextQuote = await fetchQuote(selectedService, propertyData, answers[selectedService]);
        setQuote(nextQuote);
      } catch {
        // keep previous quote if API fails
      }
    })();
  }, [answers, navigate, propertyData, selectedService, setQuote]);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    let frame = 0;
    const total = 40;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / total;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounting(Math.round(eased * targetLow));
      if (frame >= total) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [revealed]);

  return (
    <CalculatorShell step={4} screenHint="4">
      <div>
        {!revealed ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #C8922A, #e8b84b)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', position: 'relative' }}>
              <span style={{ fontSize: 28 }}>💰</span>
              <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '3px solid #C8922A', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D2B4E', marginBottom: '0.5rem' }}>Calculating your estimate...</h2>
            <p style={{ fontSize: 14, color: '#6b7280' }}>Checking local rates and availability</p>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ paddingBottom: '0.25rem' }}>
            {/* Estimate reveal */}
            <div style={{ textAlign: 'center', padding: '1.7rem 1.15rem 1.45rem', background: 'linear-gradient(135deg, #0D2B4E 0%, #0a3d5c 100%)', borderRadius: '1.25rem', marginBottom: '1.35rem', position: 'relative', overflow: 'hidden', boxShadow: '0 18px 34px rgba(13,43,78,0.28)' }}>
              {/* Gold shimmer */}
              <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(200,146,42,0.15)', filter: 'blur(20px)' }} />
              <div style={{ position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(14,124,123,0.2)', filter: 'blur(20px)' }} />

              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.62)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Your estimate
              </div>

              {/* Price range */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: '#C8922A', lineHeight: 1 }}>
                  ${counting}
                </span>
                <span style={{ fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>—</span>
                <span style={{ fontSize: 48, fontWeight: 800, color: '#C8922A', lineHeight: 1 }}>
                  ${Math.round((counting / targetLow) * targetHigh)}
                </span>
              </div>

              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', marginBottom: '1.05rem', lineHeight: 1.4 }}>
                {(selectedService || 'house').toUpperCase()} · {propertyData?.bedrooms || 3} bed · {propertyData?.bathrooms || 2} bath · {propertyData?.suburb || 'your area'}
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.9rem' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#C8922A" color="#C8922A" />)}
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginLeft: '0.375rem' }}>4.9 · 312 reviews in your area</span>
              </div>

              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                Based on your property details · Updated daily
              </div>
            </div>

            {/* What's included */}
            <div style={{ background: '#f8fffe', borderRadius: '1rem', padding: '1.05rem 1rem', marginBottom: '1.35rem', border: '1px solid #e0f2f1', boxShadow: '0 8px 16px rgba(13,43,78,0.05)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>What's included</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.62rem' }}>
                {[
                  'All rooms vacuumed and mopped',
                  'Bathrooms scrubbed and sanitised',
                  'Kitchen benches, stovetop, and sink',
                  'Dusting throughout',
                  'Bins emptied',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: 13.5, color: '#374151' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#0E7C7B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'white', fontSize: 10 }}>✓</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing breakdown */}
            <div style={{ background: 'white', borderRadius: '1rem', padding: '1.05rem 1rem', marginBottom: '1.35rem', border: '1px solid #e5e7eb', boxShadow: '0 8px 16px rgba(13,43,78,0.05)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.56rem' }}>
                {[
                  { label: 'Base rate', value: `$${Math.round(targetLow * 0.85)}-$${Math.round(targetHigh * 0.85)}` },
                  { label: 'Service adjustments', value: `$${Math.round(targetLow * 0.12)}-$${Math.round(targetHigh * 0.12)}` },
                  { label: 'Location factor', value: `$${Math.round(targetLow * 0.03)}-$${Math.round(targetHigh * 0.03)}` },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#6b7280' }}>
                    <span>{row.label}</span>
                    <span style={{ fontWeight: 600, color: '#0D2B4E' }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.62rem', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#0D2B4E' }}>
                  <span>Total estimate</span>
                  <span style={{ color: '#C8922A' }}>${targetLow}-${targetHigh}</span>
                </div>
              </div>
            </div>

            {/* Secondary actions */}
            <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.1rem' }}>
              <button style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}>
                <Mail size={16} /> Email quote
              </button>
              <button style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}>
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Primary CTA */}
            <button className="btn-gold" style={{ width: '100%', fontSize: 16, padding: '1rem', boxShadow: '0 10px 20px rgba(200,146,42,0.28)' }} onClick={() => navigate('/calculator/5')}>
              Book Now <ChevronRight size={18} />
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: '0.5rem' }}>
              No payment now · Confirm details first
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
