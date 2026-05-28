import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { AriaWidget } from './AriaWidget';
import { Monitor, Smartphone } from 'lucide-react';

interface CalculatorShellProps {
  step: number;
  totalSteps?: number;
  children: React.ReactNode;
  screenHint?: string;
}

const STEP_LABELS = ['Service', 'Property', 'Details', 'Estimate', 'Book'];

export function CalculatorShell({ step, totalSteps = 5, children, screenHint }: CalculatorShellProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const progress = (step / totalSteps) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fffe', fontFamily: 'DM Sans, Inter, sans-serif' }}>
      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '0 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Logo size="sm" />
          </button>

          {/* Step labels */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {STEP_LABELS.map((label, i) => {
              const s = i + 1;
              const isActive = s === step;
              const isDone = s < step;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.375rem 0.625rem', borderRadius: '2rem',
                    background: isActive ? '#0E7C7B' : isDone ? '#e0f2f1' : 'transparent',
                    color: isActive ? 'white' : isDone ? '#0E7C7B' : '#9ca3af',
                    fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: isActive ? 'rgba(255,255,255,0.3)' : isDone ? '#0E7C7B' : '#e5e7eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: isActive ? 'white' : isDone ? 'white' : '#9ca3af', fontWeight: 700,
                    }}>
                      {isDone ? '✓' : s}
                    </div>
                    <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div style={{ width: 16, height: 2, background: isDone ? '#0E7C7B' : '#e5e7eb', borderRadius: 1 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '0.5rem', padding: '0.25rem' }}>
            <button
              onClick={() => setViewMode('mobile')}
              style={{ padding: '0.375rem 0.625rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', background: viewMode === 'mobile' ? 'white' : 'transparent', color: viewMode === 'mobile' ? '#0E7C7B' : '#9ca3af', boxShadow: viewMode === 'mobile' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 12, fontWeight: 600, transition: 'all 0.15s' }}
            >
              <Smartphone size={14} /> Mobile
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              style={{ padding: '0.375rem 0.625rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', background: viewMode === 'desktop' ? 'white' : 'transparent', color: viewMode === 'desktop' ? '#0E7C7B' : '#9ca3af', boxShadow: viewMode === 'desktop' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 12, fontWeight: 600, transition: 'all 0.15s' }}
            >
              <Monitor size={14} /> Desktop
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: '1.25rem 1.5rem 1.75rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 80px)' }}>
        {viewMode === 'mobile' ? (
          /* Mobile phone frame */
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 'min(390px, calc(100vw - 2.75rem))', background: 'white', borderRadius: '2.5rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 8px #1a1a1a, 0 0 0 10px #333',
              overflow: 'hidden',
              height: 'min(760px, calc(100vh - 150px))',
              minHeight: 620,
            }}>
              {/* Phone notch */}
              <div style={{ height: 44, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 120, height: 28, background: '#1a1a1a', borderRadius: '0 0 1rem 1rem' }} />
              </div>
              <div style={{ padding: '0 1.25rem 2rem', overflowY: 'auto', height: 'calc(100% - 44px)' }}>
                {children}
              </div>
            </div>
            {/* Home indicator */}
            <div style={{ position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)', width: 120, height: 4, background: '#333', borderRadius: 2 }} />
          </div>
        ) : (
          /* Desktop browser frame */
          <div style={{ width: '100%', maxWidth: 900 }}>
            <div style={{
              background: '#e5e7eb', borderRadius: '0.75rem 0.75rem 0 0',
              padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <div style={{ flex: 1, background: 'white', borderRadius: '0.375rem', padding: '0.25rem 0.75rem', fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔒 homesnap.house/calculator
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '0 0 0.75rem 0.75rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', padding: '2rem 3rem 3rem', minHeight: 500 }}>
              {children}
            </div>
          </div>
        )}
      </div>

      <AriaWidget screenHint={screenHint || String(step)} />
    </div>
  );
}
