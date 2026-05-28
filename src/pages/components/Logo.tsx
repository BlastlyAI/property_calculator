interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white';
  showTagline?: boolean;
}

export function Logo({ size = 'md', variant = 'default', showTagline = false }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 18, tagline: 11 },
    md: { icon: 32, text: 24, tagline: 13 },
    lg: { icon: 48, text: 36, tagline: 16 },
  };
  const s = sizes[size];
  const navyColor = variant === 'white' ? '#ffffff' : '#0D2B4E';
  const tealColor = variant === 'white' ? '#7ee8e7' : '#0E7C7B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* House + bolt icon */}
        <svg width={s.icon} height={s.icon} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* House outline */}
          <path
            d="M20 4L36 16V36H26V26H14V36H4V16L20 4Z"
            fill={tealColor}
            opacity="0.15"
          />
          <path
            d="M20 4L36 16V36H26V26H14V36H4V16L20 4Z"
            stroke={tealColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Lightning bolt inside */}
          <path
            d="M22 14L16 22H21L18 30L26 20H21L22 14Z"
            fill={tealColor}
            stroke="none"
          />
        </svg>
        {/* Wordmark */}
        <span style={{ fontSize: s.text, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1 }}>
          <span style={{ color: navyColor }}>Home</span>
          <span style={{ color: tealColor }}>Snap</span>
        </span>
      </div>
      {showTagline && (
        <span style={{ fontSize: s.tagline, color: variant === 'white' ? 'rgba(255,255,255,0.7)' : '#6b7280', fontWeight: 400, marginTop: '2px' }}>
          Instant home service quotes. No fuss.
        </span>
      )}
    </div>
  );
}
