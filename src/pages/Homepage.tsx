import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './components/Logo';
import { MapPin, Search, Tag, Home, ChevronRight, CheckCircle, Building2, Zap } from 'lucide-react';

function TypingAnimation() {
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'reveal' | 'done'>('typing');
  const target = '12 Maple Street, Surry Hills NSW 2010';

  useEffect(() => {
    if (phase === 'typing') {
      if (displayText.length < target.length) {
        const t = setTimeout(() => setDisplayText(target.slice(0, displayText.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('reveal'), 600);
        return () => clearTimeout(t);
      }
    }
  }, [displayText, phase]);

  return (
    <div style={{ background: '#f8fffe', borderRadius: '1.25rem', padding: '1.5rem', border: '1px solid #e0f2f1', maxWidth: 480, margin: '0 auto' }}>
      {/* Address input mockup */}
      <div style={{ background: 'white', borderRadius: '0.75rem', border: phase === 'reveal' || phase === 'done' ? '2px solid #0E7C7B' : '2px solid #e5e7eb', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', transition: 'border-color 0.3s' }}>
        <MapPin size={18} color="#0E7C7B" />
        <span style={{ fontSize: 15, color: displayText ? '#0D2B4E' : '#9ca3af', flex: 1, fontFamily: 'DM Sans, sans-serif' }}>
          {displayText || 'Enter your home address'}
          {phase === 'typing' && <span style={{ borderRight: '2px solid #0E7C7B', marginLeft: 1, animation: 'none' }}>|</span>}
        </span>
        {(phase === 'reveal' || phase === 'done') && <CheckCircle size={18} color="#0E7C7B" />}
      </div>

      {/* Property reveal */}
      {(phase === 'reveal' || phase === 'done') && (
        <div className="animate-fade-in">
          {/* Satellite image placeholder */}
          <div style={{ borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1rem', position: 'relative', height: 120, background: 'linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 40%, #3a7a4a 70%, #4a9a5a 100%)' }}>
            {/* Mock satellite view */}
            <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 2, padding: 8, opacity: 0.6 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ background: i % 3 === 0 ? '#2d5a3d' : i % 3 === 1 ? '#8B6914' : '#4a7a5a', borderRadius: 2 }} />
              ))}
            </div>
            {/* House marker */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <div style={{ background: '#0E7C7B', borderRadius: '50% 50% 50% 0', width: 28, height: 28, transform: 'rotate(-45deg)', border: '3px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }} />
            </div>
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', borderRadius: '0.5rem', padding: '2px 8px', color: 'white', fontSize: 11 }}>
              12 Maple St
            </div>
          </div>

          {/* Auto-filled details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'Bedrooms', value: '3', icon: '🛏️' },
              { label: 'Bathrooms', value: '2', icon: '🚿' },
              { label: 'Home Size', value: 'Medium', icon: '📐' },
              { label: 'Type', value: 'House', icon: '🏠' },
            ].map((item, i) => (
              <div key={i} className="wow-item" style={{ background: 'white', borderRadius: '0.625rem', padding: '0.625rem 0.75rem', border: '1px solid #e0f2f1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0D2B4E' }}>{item.value}</div>
                </div>
                <CheckCircle size={14} color="#0E7C7B" style={{ marginLeft: 'auto' }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
            ✨ Pre-filled from property records — just confirm and get your quote
          </div>
        </div>
      )}
    </div>
  );
}

export function Homepage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'DM Sans, Inter, sans-serif', color: '#0D2B4E' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, background: 'white', borderBottom: '1px solid #e5e7eb', zIndex: 40, padding: '0 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Logo size="md" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#how-it-works" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>How it works</a>
            <a href="#services" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Services</a>
            <a href="#for-business" style={{ color: '#6b7280', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>For Business</a>
            <button className="btn-teal" style={{ padding: '0.625rem 1.25rem', fontSize: 14 }} onClick={() => navigate('/calculator/1')}>
              Get My Quote
            </button>
          </div>
        </div>
      </nav>

      {/* Section 1 — Hero */}
      <section style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fafa 60%, #e8f7f7 100%)', padding: '5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0f2f1', borderRadius: '2rem', padding: '0.375rem 0.875rem', marginBottom: '1.5rem' }}>
              <Zap size={14} color="#0E7C7B" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0E7C7B' }}>Instant quotes in under 60 seconds</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 800, color: '#0D2B4E', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              Get an instant home service quote in{' '}
              <span style={{ color: '#0E7C7B' }}>60 seconds</span>
            </h1>
            <p style={{ fontSize: 18, color: '#4b5563', lineHeight: 1.6, marginBottom: '2rem' }}>
              House cleaning, carpet cleaning, and window cleaning. No calls. No waiting. Just your price.
            </p>
            <button
              className="btn-teal"
              style={{ width: '100%', maxWidth: 360, fontSize: 18, padding: '1.125rem 2rem' }}
              onClick={() => navigate('/calculator/1')}
            >
              Get My Quote <ChevronRight size={20} />
            </button>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem' }}>
              {['No obligation', 'Instant estimate', 'Book in one tap'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: 13, color: '#6b7280' }}>
                  <CheckCircle size={14} color="#0E7C7B" />
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div>
            <TypingAnimation />
          </div>
        </div>
      </section>

      {/* Mobile hero (shown on small screens via responsive) */}
      <section style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fafa 100%)', padding: '3rem 1.5rem', display: 'none' }} className="mobile-hero">
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0D2B4E', marginBottom: '1rem' }}>
            Instant home service quotes in <span style={{ color: '#0E7C7B' }}>60 seconds</span>
          </h1>
          <p style={{ fontSize: 16, color: '#4b5563', marginBottom: '1.5rem' }}>No calls. No waiting. Just your price.</p>
          <button className="btn-teal" style={{ width: '100%', fontSize: 17, padding: '1rem' }} onClick={() => navigate('/calculator/1')}>
            Get My Quote <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Section 2 — How It Works */}
      <section id="how-it-works" style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0D2B4E', marginBottom: '0.75rem' }}>
            How it works
          </h2>
          <p style={{ fontSize: 17, color: '#6b7280', marginBottom: '3.5rem' }}>Three steps. Under 60 seconds. Done.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              { icon: <MapPin size={32} color="#0E7C7B" />, step: '01', title: 'Enter your address', desc: 'Type your home address and select the service you need. Takes 10 seconds.' },
              { icon: <Search size={32} color="#0E7C7B" />, step: '02', title: 'We find your property', desc: 'HomeSnap automatically looks up your property details — bedrooms, size, type. No typing required.' },
              { icon: <Tag size={32} color="#C8922A" />, step: '03', title: 'Get your instant estimate', desc: 'Your personalised price range appears instantly. Book directly or email the quote to yourself.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem 1.5rem', borderRadius: '1.25rem', background: '#f8fffe', border: '1px solid #e0f2f1' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 2px 12px rgba(14,124,123,0.15)' }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0E7C7B', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>STEP {item.step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0D2B4E', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — The Wow Moment */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #0D2B4E 0%, #0a3d5c 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div style={{ color: 'white' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(200,146,42,0.2)', borderRadius: '2rem', padding: '0.375rem 0.875rem', marginBottom: '1.5rem', border: '1px solid rgba(200,146,42,0.4)' }}>
              <Zap size={14} color="#C8922A" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#C8922A' }}>The magic moment</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: '1.25rem', lineHeight: 1.2 }}>
              We already know your home
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              We look up your property details automatically so you barely have to type anything. Just confirm what we found and get your quote.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                'Bedrooms and bathrooms pre-filled from property records',
                'Home size estimated from council data',
                'Property type identified automatically',
                'You just confirm — no typing required',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={18} color="#0E7C7B" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            {/* Animated wow moment demo */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ background: 'white', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <MapPin size={16} color="#0E7C7B" />
                  <span style={{ fontSize: 14, color: '#0D2B4E', fontWeight: 500 }}>12 Maple Street, Surry Hills NSW 2010</span>
                  <CheckCircle size={16} color="#0E7C7B" style={{ marginLeft: 'auto' }} />
                </div>
                <div style={{ height: 1, background: '#e5e7eb', marginBottom: '0.75rem' }} />
                <div style={{ fontSize: 12, color: '#0E7C7B', fontWeight: 600, marginBottom: '0.5rem' }}>✨ Property found — details pre-filled</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { label: 'Bedrooms', value: '3 🛏️' },
                    { label: 'Bathrooms', value: '2 🚿' },
                    { label: 'Size', value: 'Medium 📐' },
                    { label: 'Type', value: 'House 🏠' },
                    { label: 'Storeys', value: 'Single ⬆️' },
                    { label: 'Land', value: '450 sqm 🌿' },
                  ].map((item, i) => (
                    <div key={i} className="wow-item" style={{ background: '#f0fafa', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
                      <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0D2B4E' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                "This system already knows my home" — that's the reaction we're after
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — The Three Services */}
      <section id="services" style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0D2B4E', marginBottom: '0.75rem' }}>
            Three services. One quote tool.
          </h2>
          <p style={{ fontSize: 17, color: '#6b7280', marginBottom: '3rem' }}>Choose your service and get an instant estimate.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              {
                icon: '🧹',
                title: 'House & Home Cleaning',
                desc: 'Regular cleans, deep cleans, and end of lease. Priced by bedrooms, bathrooms, and condition.',
                from: '$120',
                color: '#0E7C7B',
                bg: '#f0fafa',
              },
              {
                icon: '🏠',
                title: 'Carpet Cleaning',
                desc: 'Steam cleaning, stain treatment, and deodorising. Priced by rooms and carpet condition.',
                from: '$80',
                color: '#0D2B4E',
                bg: '#f0f4ff',
              },
              {
                icon: '🪟',
                title: 'Window Cleaning',
                desc: 'Interior and exterior window cleaning. Priced by window count and access requirements.',
                from: '$95',
                color: '#C8922A',
                bg: '#fffbf0',
              },
            ].map((svc, i) => (
              <div key={i} style={{ background: svc.bg, borderRadius: '1.25rem', padding: '2rem', border: `1px solid ${svc.color}22`, textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 40, marginBottom: '1rem' }}>{svc.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0D2B4E', marginBottom: '0.75rem' }}>{svc.title}</h3>
                <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>{svc.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>FROM</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: svc.color }}>{svc.from}</div>
                  </div>
                </div>
                <button
                  className="btn-teal"
                  style={{ width: '100%', background: svc.color }}
                  onClick={() => navigate('/calculator/1')}
                >
                  Get a Quote <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — For Business */}
      <section id="for-business" style={{ padding: '5rem 1.5rem', background: '#f8fffe', borderTop: '1px solid #e0f2f1' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0f2f1', borderRadius: '2rem', padding: '0.375rem 0.875rem', marginBottom: '1.25rem' }}>
              <Building2 size={14} color="#0E7C7B" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0E7C7B' }}>For cleaning businesses</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, color: '#0D2B4E', marginBottom: '1rem' }}>
              Are you a cleaning business?
            </h2>
            <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Get this calculator on your website for free. Every quote request becomes a lead that comes directly to you. Powered by Blastly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {['Free to add to your website', 'Every quote is a qualified lead', 'Leads go straight to your Blastly inbox', 'Your branding, your colours'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: 15, color: '#374151' }}>
                  <CheckCircle size={16} color="#0E7C7B" />
                  {f}
                </div>
              ))}
            </div>
            <button className="btn-teal" onClick={() => navigate('/embed-demo')}>
              Add HomeSnap to My Website <ChevronRight size={16} />
            </button>
          </div>
          <div style={{ background: 'white', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 4px 24px rgba(14,124,123,0.1)', border: '1px solid #e0f2f1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: '#0E7C7B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={20} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0D2B4E', fontSize: 15 }}>Sparkle Clean Co.</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>sparkle-clean.com.au</div>
              </div>
            </div>
            <div style={{ background: '#f0fafa', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 12, color: '#0E7C7B', fontWeight: 600, marginBottom: '0.5rem' }}>📥 New quote request</div>
              <div style={{ fontSize: 14, color: '#0D2B4E' }}>Sarah M. — 3 bed house clean — Surry Hills</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: '0.25rem' }}>Estimate shown: $150–$175</div>
            </div>
            <div style={{ background: '#f0fafa', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 12, color: '#0E7C7B', fontWeight: 600, marginBottom: '0.5rem' }}>📥 New quote request</div>
              <div style={{ fontSize: 14, color: '#0D2B4E' }}>James T. — End of lease clean — Newtown</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: '0.25rem' }}>Estimate shown: $280–$320</div>
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>Powered by HomeSnap · Blastly integration</div>
          </div>
        </div>
      </section>

      {/* Section 6 — Footer */}
      <footer style={{ background: '#0D2B4E', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '2.5rem' }}>
            <div>
              <Logo size="md" variant="white" showTagline />
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, marginTop: '1rem', maxWidth: 280 }}>
                Get your price in 60 seconds. Book without repeating yourself.
              </p>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', marginBottom: '1rem' }}>PRODUCT</div>
              {['How it works', 'House Cleaning', 'Carpet Cleaning', 'Window Cleaning'].map(l => (
                <div key={l} style={{ marginBottom: '0.625rem' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>{l}</a>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', marginBottom: '1rem' }}>COMPANY</div>
              {['For Businesses', 'Privacy Policy', 'Terms of Service', 'Contact'].map(l => (
                <div key={l} style={{ marginBottom: '0.625rem' }}>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14 }}>{l}</a>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>© 2026 HomeSnap. All rights reserved.</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              Powered by{' '}
              <a href="https://blastly.ai" style={{ color: '#0E7C7B', textDecoration: 'none' }}>Blastly</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
