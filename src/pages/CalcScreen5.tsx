import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalculatorShell } from './components/CalculatorShell';
import { ChevronRight, Calendar, Clock } from 'lucide-react';
import { useCalculator } from '../state/calculatorContext';

const TIMES = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM'];

export function CalcScreen5() {
  const navigate = useNavigate();
  const { selectedService, propertyData, quote } = useCalculator();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  });

  const canSubmit = name && phone && selectedDate !== null && selectedTime;

  return (
    <CalculatorShell step={5} screenHint="5">
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D2B4E', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
          Almost done — when works for you?
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: '1.2rem', lineHeight: 1.45 }}>
          {(selectedService || 'house')} cleaning · ${quote?.low || 150}-${quote?.high || 185} · {propertyData?.formattedAddress || 'Selected address'}
        </p>

        {/* Date picker */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} /> Choose a date
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {dates.slice(0, 10).map((d, i) => {
              const dayName = d.toLocaleDateString('en-AU', { weekday: 'short' });
              const dayNum = d.getDate();
              const month = d.toLocaleDateString('en-AU', { month: 'short' });
              const isSelected = selectedDate === i;
              return (
                <button key={i} onClick={() => setSelectedDate(i)}
                  style={{ flexShrink: 0, width: 52, padding: '0.625rem 0.25rem', borderRadius: '0.75rem', border: isSelected ? '1.5px solid #0E7C7B' : '1.5px solid #e5e7eb', background: isSelected ? '#0E7C7B' : 'white', cursor: 'pointer', textAlign: 'center', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s', boxShadow: isSelected ? '0 6px 14px rgba(14,124,123,0.2)' : '0 2px 4px rgba(13,43,78,0.04)' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.8)' : '#9ca3af', textTransform: 'uppercase' }}>{dayName}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: isSelected ? 'white' : '#0D2B4E', lineHeight: 1.2 }}>{dayNum}</div>
                  <div style={{ fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}>{month}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time picker */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={14} /> Preferred start time
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {TIMES.map(t => (
              <button key={t} onClick={() => setSelectedTime(t)}
                style={{ padding: '0.5rem 0.875rem', borderRadius: '2rem', border: selectedTime === t ? '1.5px solid #0E7C7B' : '1.5px solid #e5e7eb', background: selectedTime === t ? '#f0fafa' : 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: selectedTime === t ? '#0E7C7B' : '#374151', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Contact details */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your details
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', background: '#fbfdfd', border: '1px solid #e7eef0', borderRadius: '0.9rem', padding: '0.75rem' }}>
            {[
              { label: 'Full name', value: name, onChange: setName, placeholder: 'Sarah Mitchell', type: 'text' },
              { label: 'Mobile number', value: phone, onChange: setPhone, placeholder: '04xx xxx xxx', type: 'tel' },
              { label: 'Email (optional)', value: email, onChange: setEmail, placeholder: 'sarah@email.com', type: 'email' },
            ].map(field => (
              <div key={field.label}>
                <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: '0.25rem' }}>{field.label}</label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #dfe8ea', borderRadius: '0.75rem', fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0D2B4E', transition: 'all 0.2s', background: 'white', boxShadow: '0 2px 4px rgba(13,43,78,0.03)' }}
                  onFocus={e => e.target.style.borderColor = '#0E7C7B'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: '0.25rem' }}>Special instructions (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Key under mat, dog in backyard, focus on kitchen..."
            rows={3}
            style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #dfe8ea', borderRadius: '0.75rem', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#0D2B4E', resize: 'none', lineHeight: 1.5, boxShadow: '0 2px 4px rgba(13,43,78,0.03)' }}
            onFocus={e => e.target.style.borderColor = '#0E7C7B'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Summary box */}
        <div style={{ background: 'linear-gradient(180deg, #f4fcfc 0%, #edf8f8 100%)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.25rem', border: '1px solid #c6e9e9', boxShadow: '0 8px 20px rgba(14,124,123,0.08)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0E7C7B', marginBottom: '0.625rem' }}>Booking summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {[
              { label: 'Service', value: `${selectedService || 'house'} cleaning` },
              { label: 'Address', value: propertyData?.formattedAddress || 'Selected address' },
              { label: 'Estimate', value: `$${quote?.low || 150}-${quote?.high || 185}` },
              { label: 'Date', value: selectedDate !== null ? dates[selectedDate].toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }) : '—' },
              { label: 'Time', value: selectedTime || '—' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6b7280' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: '#0D2B4E' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-gold"
          disabled={!canSubmit}
          style={{ width: '100%', fontSize: 16, padding: '1rem' }}
          onClick={() => navigate('/calculator/confirm')}
        >
          Confirm Booking Request <ChevronRight size={18} />
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: '0.5rem' }}>
          No payment now · The cleaner will confirm within 2 hours
        </p>
      </div>
    </CalculatorShell>
  );
}
