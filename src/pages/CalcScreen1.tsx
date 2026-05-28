import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalculatorShell } from './components/CalculatorShell';
import { MapPin, ChevronRight, CheckCircle } from 'lucide-react';
import { fetchAddressPredictions, resolveAddressFromText, type PlacePrediction } from '../services/propertyApi';
import { useCalculator } from '../state/calculatorContext';
import type { ServiceId } from '../types/calculator';

export function CalcScreen1() {
  const navigate = useNavigate();
  const { selectedService, setSelectedService, addressSelection, setAddressSelection, serviceConfigs } = useCalculator();
  const [address, setAddress] = useState(addressSelection?.formattedAddress || '');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasValidAddress, setHasValidAddress] = useState(Boolean(addressSelection?.placeId));
  const [addressError, setAddressError] = useState<string | null>(null);

  const canProceed = Boolean(addressSelection?.placeId) && selectedService !== null;

  const proceedToNext = async () => {
    if (selectedService === null) return;
    if (addressSelection?.placeId) {
      navigate('/calculator/2', {
        state: {
          selectedService,
          addressSelection,
        },
      });
      return;
    }
    const typed = address.trim();
    if (typed.length < 3) return;
    try {
      setSubmitting(true);
      const resolved = await resolveAddressFromText(typed);
      if (resolved.matchQuality === 'near') {
        setAddressError('Exact ghar number match nahi mila. Nearest area address use kiya jayega.');
      }
      setAddressSelection({
        placeId: resolved.placeId,
        formattedAddress: resolved.formattedAddress || resolved.description,
        lat: resolved.lat ?? null,
        lng: resolved.lng ?? null,
        suburb: resolved.suburb ?? null,
        state: resolved.state ?? null,
        postcode: resolved.postcode ?? null,
        provider: resolved.provider,
        matchQuality: resolved.matchQuality,
      });
      setHasValidAddress(true);
      navigate('/calculator/2', {
        state: {
          selectedService,
          addressSelection: {
            placeId: resolved.placeId,
            formattedAddress: resolved.formattedAddress || resolved.description,
            lat: resolved.lat ?? null,
            lng: resolved.lng ?? null,
            suburb: resolved.suburb ?? null,
            state: resolved.state ?? null,
            postcode: resolved.postcode ?? null,
            provider: resolved.provider,
          },
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to validate this address';
      setAddressError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddressChange = (v: string) => {
    setAddress(v);
    setHasValidAddress(false);
    setAddressSelection({ placeId: '', formattedAddress: v });
    setAddressError(null);
  };

  useEffect(() => {
    const q = address.trim();
    if (q.length < 3 || hasValidAddress) {
      setPredictions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setLoadingPredictions(true);
        const next = await fetchAddressPredictions(q);
        setPredictions(next);
        setAddressError(null);
        if (!next.length) {
          setAddressError("No valid address suggestions found.");
        } else if (/\d/.test(q) && !/\d/.test(next[0]?.description || '')) {
          setAddressError("Exact ghar number match mushkil hai, lekin nearest address suggestion available hai.");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to fetch address suggestions";
        setAddressError(message);
        setPredictions([]);
      } finally {
        setLoadingPredictions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [address, hasValidAddress]);

  return (
    <CalculatorShell step={1} screenHint="1">
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D2B4E', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
          What can we help you with today?
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: '1.5rem' }}>
          Enter your address and choose a service to get started.
        </p>

        {/* Address input */}
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your home address
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} color="#0E7C7B" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              value={address}
              onChange={e => handleAddressChange(e.target.value)}
              placeholder="Start typing your address..."
              style={{
                width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
                border: hasValidAddress ? '2px solid #0E7C7B' : '2px solid #e5e7eb',
                borderRadius: '0.75rem', fontSize: 15, fontFamily: 'DM Sans, sans-serif',
                outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                color: '#0D2B4E',
              }}
            />
            {hasValidAddress && (
              <CheckCircle size={18} color="#0E7C7B" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
            )}
          </div>
          {loadingPredictions && (
            <div style={{ marginTop: 6, fontSize: 12, color: '#6b7280' }}>Loading address suggestions...</div>
          )}
          {addressError && (
            <div style={{ marginTop: 6, fontSize: 12, color: '#b91c1c' }}>{addressError}</div>
          )}
          {predictions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb', zIndex: 10, overflow: 'hidden', marginTop: 4 }}>
              {predictions.map((s) => (
                <button key={s.placeId} onClick={() => {
                  setAddress(s.description);
                  setHasValidAddress(true);
                  setPredictions([]);
                  setAddressSelection({
                    placeId: s.placeId,
                    formattedAddress: s.formattedAddress || s.description,
                    lat: s.lat ?? null,
                    lng: s.lng ?? null,
                    suburb: s.suburb ?? null,
                    state: s.state ?? null,
                    postcode: s.postcode ?? null,
                    provider: s.provider,
                    matchQuality: /\d/.test(address) && !/\d/.test(s.description || '') ? 'near' : 'exact',
                  });
                }}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 14, color: '#0D2B4E', borderBottom: '1px solid #f3f4f6' }}>
                  <MapPin size={14} color="#9ca3af" />
                  {s.description}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Service cards */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Choose your service
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {serviceConfigs.map(svc => (
              <button
                key={svc.id}
                onClick={() => setSelectedService(svc.id as ServiceId)}
                style={{
                  width: '100%', padding: '1rem 1.125rem',
                  border: selectedService === svc.id ? '2px solid #0E7C7B' : '2px solid #e5e7eb',
                  borderRadius: '0.875rem', background: selectedService === svc.id ? '#f0fafa' : 'white',
                  cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.875rem',
                  transition: 'all 0.15s', boxShadow: selectedService === svc.id ? '0 0 0 4px rgba(14,124,123,0.1)' : 'none',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                <span style={{ fontSize: 28 }}>{svc.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0D2B4E', marginBottom: '0.125rem' }}>{svc.title}</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>{svc.description}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{svc.startingFromLabel}</div>
                  {selectedService === svc.id && <CheckCircle size={18} color="#0E7C7B" style={{ marginTop: 4 }} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Multi-service link */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <button style={{ background: 'none', border: 'none', color: '#0E7C7B', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
            Need more than one service? Get a combined quote
          </button>
        </div>

        {/* CTA */}
        <button
          className="btn-teal"
          disabled={selectedService === null || submitting}
          style={{ width: '100%', fontSize: 16, padding: '1rem' }}
          onClick={proceedToNext}
        >
          {submitting ? 'Validating address...' : 'Get My Quote'} {!submitting && <ChevronRight size={18} />}
        </button>
        {!canProceed && !submitting && (
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: '0.5rem' }}>
            Enter your address and select a service to continue
          </p>
        )}
      </div>
    </CalculatorShell>
  );
}
