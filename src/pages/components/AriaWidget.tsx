import { useState } from 'react';
import { X, Send } from 'lucide-react';

interface AriaWidgetProps {
  screenHint?: string;
}

const SCREEN_PROMPTS: Record<string, string> = {
  '1': 'Not sure which service you need? I can help you choose.',
  '2': "That's your home! Just check the details look right.",
  '3': "Not sure what to pick? I can help you decide.",
  '4': "That looks like a great price for your area. Want me to check availability?",
  '5': "Almost done! I'll make sure you get the best provider in your area.",
};

export function AriaWidget({ screenHint = '1' }: AriaWidgetProps) {
  const [open, setOpen] = useState(false);
  const [waved, setWaved] = useState(false);
  const [message, setMessage] = useState('');

  const prompt = SCREEN_PROMPTS[screenHint] || "Need help? Just ask.";

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50 }}>
      {/* Chat panel */}
      {open && (
        <div className="animate-slide-in" style={{
          position: 'absolute', bottom: '5.5rem', right: 0,
          width: '280px', background: 'white', borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)', overflow: 'hidden',
          border: '1px solid #e5e7eb'
        }}>
          {/* Header */}
          <div style={{ background: '#0E7C7B', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👩</div>
              <div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>Aria</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>HomeSnap Assistant</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}>
              <X size={16} />
            </button>
          </div>
          {/* Messages */}
          <div style={{ padding: '1rem', minHeight: 80 }}>
            <div style={{ background: '#f0fafa', borderRadius: '0.75rem 0.75rem 0.75rem 0.25rem', padding: '0.625rem 0.875rem', fontSize: 13, color: '#0D2B4E', lineHeight: 1.5, marginBottom: '0.5rem' }}>
              {prompt}
            </div>
          </div>
          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem' }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            />
            <button style={{ background: '#0E7C7B', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Bubble hint when not open */}
      {!open && !waved && (
        <div className="animate-slide-in" style={{
          position: 'absolute', bottom: '5.5rem', right: 0,
          background: 'white', borderRadius: '0.75rem 0.75rem 0 0.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', padding: '0.625rem 0.875rem',
          fontSize: 12, color: '#0D2B4E',
          border: '1px solid #e5e7eb', maxWidth: 200, whiteSpace: 'normal', lineHeight: 1.4
        }}>
          Need help? Just ask 👋
        </div>
      )}

      {/* Avatar button */}
      <button
        onClick={() => { setOpen(!open); setWaved(true); }}
        className="aria-glow"
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0E7C7B, #0a6160)',
          border: '3px solid #C8922A',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, boxShadow: '0 4px 16px rgba(14,124,123,0.4)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        title="Chat with Aria"
      >
        👩‍💼
      </button>
    </div>
  );
}
