import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './components/Logo';

const BUSINESS_SLUG = 'sparkle-clean-co';
const CALC_URL = `homesnap.house/${BUSINESS_SLUG}`;
const EMBED_CODE = `<script src="https://homesnap.house/embed.js" data-business="${BUSINESS_SLUG}"></script>`;

export function BusinessSuccess() {
  const navigate = useNavigate();
  const [checkVisible, setCheckVisible] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setCheckVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <Logo size="md" />
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

        {/* Success hero */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: checkVisible ? '#00B5AD' : '#e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            transition: 'background 0.4s ease',
            fontSize: 36,
          }}>
            {checkVisible ? '✓' : ''}
          </div>
          <style>{`
            @keyframes popIn { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          `}</style>
          <h1 style={{
            fontSize: 30, fontWeight: 700, color: '#0D2B4E', margin: 0,
            animation: checkVisible ? 'popIn 0.4s ease 0.3s both' : 'none',
          }}>
            Your calculator is live 🎉
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.75rem', fontSize: 15 }}>
            Customers can now get an instant quote from your business
          </p>
        </div>

        {/* Three cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>

          {/* Card 1 — URL */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fffe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔗</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>Your Calculator URL</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Share this link anywhere</div>
              </div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: 14, color: '#0D2B4E', marginBottom: '0.75rem', wordBreak: 'break-all' }}>
              {CALC_URL}
            </div>
            <button
              onClick={() => handleCopy(CALC_URL, 'url')}
              style={{ width: '100%', padding: '0.75rem', background: copied === 'url' ? '#00B5AD' : '#0D2B4E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            >
              {copied === 'url' ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* Card 2 — Embed */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fffe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💻</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>Embed on Your Website</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Paste this anywhere on your website. Works on any platform.</div>
              </div>
            </div>
            <div style={{ background: '#0D2B4E', borderRadius: 10, padding: '0.75rem 1rem', fontFamily: 'monospace', fontSize: 12, color: '#00B5AD', marginBottom: '0.75rem', wordBreak: 'break-all', lineHeight: 1.6 }}>
              {EMBED_CODE}
            </div>
            <button
              onClick={() => handleCopy(EMBED_CODE, 'embed')}
              style={{ width: '100%', padding: '0.75rem', background: copied === 'embed' ? '#00B5AD' : '#0D2B4E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            >
              {copied === 'embed' ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>

          {/* Card 3 — QR */}
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fffe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📱</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>Your QR Code</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Print this on business cards, flyers, and van signage.</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://${CALC_URL}&color=0D2B4E&bgcolor=FFFFFF`}
                alt="QR Code"
                style={{ width: 160, height: 160, borderRadius: 8 }}
              />
            </div>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://${CALC_URL}&color=0D2B4E&bgcolor=FFFFFF`;
                link.download = 'homesnap-qr.png';
                link.click();
              }}
              style={{ width: '100%', padding: '0.75rem', background: '#0D2B4E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Download QR Code
            </button>
          </div>
        </div>

        {/* Preview button */}
        <button
          onClick={() => window.open('/business/demo-calculator', '_blank')}
          style={{ width: '100%', padding: '0.9rem', background: 'transparent', color: '#0D2B4E', border: '2px solid #0D2B4E', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem' }}
        >
          Preview My Calculator
        </button>

        {/* Blastly upsell box */}
        <div style={{ border: '2px solid #D4AF37', borderRadius: 16, padding: '1.5rem', background: '#fffdf0' }}>
          <div style={{ fontSize: 20, marginBottom: '0.5rem' }}>✨</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0D2B4E', margin: '0 0 0.5rem' }}>
            Want a free website and social media for your business as well?
          </h3>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
            It takes about 3 minutes and costs nothing extra. We post to your Facebook and Instagram automatically every week.
          </p>
          <button
            onClick={() => navigate('/business/upsell')}
            style={{ width: '100%', padding: '0.9rem', background: '#D4AF37', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: '0.75rem' }}
          >
            Yes — Set Up My Free Website
          </button>
          <button
            style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
