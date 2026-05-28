import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalculatorShell } from './components/CalculatorShell';
import { ChevronRight, Plus, Minus } from 'lucide-react';
import { useCalculator } from '../state/calculatorContext';
import type { ServiceConfig, ServiceQuestion } from '../types/calculator';

type ServiceType = 'house' | 'carpet' | 'windows';

function QuestionRenderer({
  question,
  value,
  onChange,
  propertySeed,
}: {
  question: ServiceQuestion;
  value: unknown;
  onChange: (next: unknown) => void;
  propertySeed?: number;
}) {
  const selected = value;
  const opts = question.options || [];
  const cardWrapStyle: CSSProperties = {
    marginBottom: '1rem',
    background: 'linear-gradient(180deg, #ffffff 0%, #fcfefe 100%)',
    border: '1px solid #e6efef',
    borderRadius: '1rem',
    padding: '0.95rem',
    boxShadow: '0 8px 18px rgba(13,43,78,0.05)',
  };
  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: '#607082',
    marginBottom: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  };

  if (question.type === 'counter') {
    const current = typeof selected === 'number' ? selected : (propertySeed || question.min || 1);
    return (
      <div style={cardWrapStyle}>
        <label style={labelStyle}>{question.label}</label>
        <div style={{ borderRadius: '0.8rem', padding: '0.8rem', border: '1px solid #e6efef', background: '#fbfefe' }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: '0.5rem' }}>{question.helperText || ''}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => onChange(Math.max(question.min || 1, current - 1))} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #dbe5e7', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}><Minus size={16} /></button>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', minWidth: 40, textAlign: 'center' }}>{current}</span>
            <button onClick={() => onChange(Math.min(question.max || 50, current + 1))} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #0E7C7B', background: '#f0fafa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0E7C7B', transition: 'all 0.15s' }}><Plus size={16} /></button>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{question.unitLabel}</span>
          </div>
        </div>
      </div>
    );
  }

  if (question.type === 'gridCards') {
    return (
      <div style={cardWrapStyle}>
        <label style={labelStyle}>{question.label}</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
          {opts.map((opt) => (
            <button key={opt.id} onClick={() => onChange(opt.id)} style={{ padding: '0.875rem', borderRadius: '0.875rem', border: selected === opt.id ? '1.5px solid #0E7C7B' : '1.5px solid #e5e7eb', background: selected === opt.id ? '#f0fafa' : 'white', cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s', boxShadow: selected === opt.id ? '0 4px 10px rgba(14,124,123,0.12)' : 'none' }}>
              <div style={{ fontSize: 22, marginBottom: '0.375rem' }}>{opt.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: selected === opt.id ? '#0E7C7B' : '#0D2B4E' }}>{opt.label}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: '0.125rem' }}>{opt.description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'binaryCards') {
    return (
      <div style={cardWrapStyle}>
        <label style={labelStyle}>{question.label}</label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {opts.map((opt) => (
            <button key={opt.id} onClick={() => onChange(opt.id)} style={{ flex: 1, padding: '0.875rem', borderRadius: '0.875rem', border: selected === opt.id ? '1.5px solid #0E7C7B' : '1.5px solid #e5e7eb', background: selected === opt.id ? '#f0fafa' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: selected === opt.id ? '#0E7C7B' : '#0D2B4E' }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: '0.25rem' }}>{opt.description}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'binaryPills') {
    return (
      <div style={cardWrapStyle}>
        <label style={labelStyle}>{question.label}</label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {opts.map((opt) => (
            <button key={opt.id} onClick={() => onChange(opt.id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '999px', border: selected === opt.id ? '1.5px solid #0E7C7B' : '1.5px solid #dfe7ea', background: selected === opt.id ? '#f0fafa' : 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: selected === opt.id ? '#0E7C7B' : '#374151', transition: 'all 0.2s' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'singleList') {
    return (
      <div style={cardWrapStyle}>
        <label style={labelStyle}>{question.label}</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {opts.map((opt) => (
            <button key={opt.id} onClick={() => onChange(opt.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', borderRadius: '0.875rem', border: selected === opt.id ? '1.5px solid #0E7C7B' : '1.5px solid #e5e7eb', background: selected === opt.id ? '#f0fafa' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <span style={{ fontSize: 22 }}>{opt.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: selected === opt.id ? '#0E7C7B' : '#0D2B4E' }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{opt.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={cardWrapStyle}>
      <label style={labelStyle}>{question.label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {opts.map((opt) => {
          const list = Array.isArray(selected) ? (selected as string[]) : [];
          const active = list.includes(opt.id);
          return (
            <button key={opt.id} onClick={() => onChange(active ? list.filter((v) => v !== opt.id) : [...list, opt.id])}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: active ? '1.5px solid #0E7C7B' : '1.5px solid #e5e7eb', background: active ? '#f0fafa' : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 20, height: 20, borderRadius: '0.25rem', border: active ? '2px solid #0E7C7B' : '2px solid #d1d5db', background: active ? '#0E7C7B' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {active && <span style={{ color: 'white', fontSize: 12 }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#0D2B4E' }}>{opt.label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0E7C7B' }}>{opt.priceLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DynamicDetails({ service, onNext }: { service: ServiceConfig; onNext: () => void }) {
  const { propertyData, answers, updateAnswers } = useCalculator();
  const [localAnswers, setLocalAnswers] = useState<Record<string, unknown>>((answers[service.id] as Record<string, unknown>) || {});
  const [activeQuestion, setActiveQuestion] = useState(0);

  const subtitle = `${service.title} · ${propertyData?.bedrooms || 3} bed · ${propertyData?.bathrooms || 2} bath · ${propertyData?.suburb || 'your area'}`;

  const onAnswerChange = (questionId: string, value: unknown) => {
    setLocalAnswers((prev) => ({ ...prev, [questionId]: value }));
    const index = service.questions.findIndex((q) => q.id === questionId);
    if (index >= 0) {
      setActiveQuestion(Math.min(service.questions.length - 1, index + 1));
    }
  };

  const focusedQuestions = useMemo(() => {
    const byId = new Map(service.questions.map((q) => [q.id, q]));
    const isLargeHome = (propertyData?.bedrooms || 0) >= 4 || propertyData?.sizeBand === 'large';
    const isUnit = propertyData?.propertyType === 'unit';
    const isDouble = propertyData?.storeys === 'double';

    if (service.id === 'house') {
      const frequencyQuestion: ServiceQuestion = {
        id: 'frequency',
        label: 'Cleaning frequency',
        type: 'binaryPills',
        options: [
          { id: 'weekly', label: 'Weekly' },
          { id: 'fortnightly', label: 'Fortnightly' },
          { id: 'monthly', label: 'Monthly' },
        ],
      };
      const extras = byId.get('extras');
      const condition = byId.get('condition');
      const pets = byId.get('pets');
      return [condition, pets, frequencyQuestion, extras].filter(Boolean) as ServiceQuestion[];
    }

    if (service.id === 'carpet') {
      const stairsQuestion: ServiceQuestion = {
        id: 'stairs',
        label: 'Any carpeted stairs?',
        type: 'binaryPills',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
        ],
      };
      const rooms = byId.get('rooms');
      const stain = byId.get('stain');
      const extras = byId.get('extras');
      const ordered = [rooms, stain, isDouble ? stairsQuestion : stairsQuestion, extras].filter(Boolean) as ServiceQuestion[];
      return ordered.slice(0, 4);
    }

    const frequencyQuestion: ServiceQuestion = {
      id: 'frequency',
      label: 'Cleaning frequency',
      type: 'binaryPills',
      options: [
        { id: 'once-off', label: 'One-off' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'quarterly', label: 'Quarterly' },
      ],
    };
    const windowCount = byId.get('windowCount');
    const scope = byId.get('scope');
    const hardAccess = byId.get('hardAccess');
    const extras = byId.get('extras');
    const maybeHardAccess = isUnit ? null : hardAccess;
    const list = [windowCount, scope, maybeHardAccess || frequencyQuestion, extras || frequencyQuestion]
      .filter(Boolean) as ServiceQuestion[];
    if (isLargeHome && list[2]?.id !== 'hardAccess') list[2] = hardAccess || list[2];
    return list.slice(0, 4);
  }, [propertyData, service.id, service.questions]);

  const smartHint = useMemo(() => {
    if (!propertyData) return null;
    if (propertyData.propertyType === 'unit') return 'Apartment detected: we prioritize interior-focused options.';
    if (propertyData.storeys === 'double') return 'Double-storey home detected: consider options that include stairs and upper-level access.';
    if ((propertyData.bedrooms || 0) >= 4) return 'Large home detected: selecting deep-clean extras may improve estimate quality.';
    return 'Your property profile has been pre-read to speed up your quote.';
  }, [propertyData]);

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0D2B4E', marginBottom: '0.45rem', marginTop: '0.45rem', letterSpacing: '-0.01em' }}>
        Tell us a bit more about your service
      </h2>
      <p style={{ fontSize: 14, color: '#6b7280', marginBottom: '0.875rem', lineHeight: 1.45 }}>{subtitle}</p>
      <div style={{ marginBottom: '0.95rem', background: '#f6fbfb', border: '1px solid #ddeded', borderRadius: '0.875rem', padding: '0.75rem 0.8rem' }}>
        <div style={{ fontSize: 11, color: '#5f7181', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>Smart assistant</div>
        <div style={{ fontSize: 13, color: '#3b4d5e' }}>{smartHint}</div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ height: 6, borderRadius: 999, background: '#e8f1f3', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.max(12, ((activeQuestion + 1) / Math.max(1, focusedQuestions.length)) * 100)}%`, background: 'linear-gradient(90deg, #0E7C7B 0%, #41a8a7 100%)', transition: 'width 0.35s ease' }} />
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: '#7a8a98' }}>Question {Math.min(activeQuestion + 1, focusedQuestions.length)} of {focusedQuestions.length}</div>
      </div>

      {focusedQuestions.map((question) => {
        const seed = Number(propertyData?.[question.defaultFromProperty || 'bedrooms'] || 0);
        return (
          <QuestionRenderer
            key={question.id}
            question={question}
            value={localAnswers[question.id]}
            onChange={(next) => onAnswerChange(question.id, next)}
            propertySeed={seed}
          />
        );
      })}

      <button className="btn-teal" style={{ width: '100%', fontSize: 16, padding: '1rem' }} onClick={() => {
        const normalized = { ...localAnswers };
        if (normalized.pets === 'yes') normalized.pets = true;
        if (normalized.pets === 'no') normalized.pets = false;
        if (normalized.hardAccess === 'yes') normalized.hardAccess = true;
        if (normalized.hardAccess === 'no') normalized.hardAccess = false;
        updateAnswers(service.id, normalized);
        onNext();
      }}>
        Continue to Estimate <ChevronRight size={18} />
      </button>
    </div>
  );
}

export function CalcScreen3() {
  const navigate = useNavigate();
  const { selectedService, serviceConfigs } = useCalculator();
  const serviceType = (selectedService || 'house') as ServiceType;
  const serviceMap = useMemo(() => new Map(serviceConfigs.map((s) => [s.id, s])), [serviceConfigs]);
  const service = serviceMap.get(serviceType);

  return (
    <CalculatorShell step={3} screenHint="3">
      <div>
        <div style={{ marginBottom: '0.9rem', background: '#f4fbfb', border: '1px solid #dcebed', borderRadius: '0.9rem', padding: '0.65rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: 22 }}>{service?.icon}</span>
          <div>
            <div style={{ fontSize: 11, color: '#607082', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Selected service</div>
            <div style={{ fontSize: 14, color: '#0D2B4E', fontWeight: 700 }}>{service?.title || 'House Cleaning'}</div>
          </div>
        </div>
        {service && <DynamicDetails service={service} onNext={() => navigate('/calculator/4')} />}
      </div>
    </CalculatorShell>
  );
}
