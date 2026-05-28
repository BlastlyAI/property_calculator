import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalculatorShell } from './components/CalculatorShell';
import { CheckCircle, MapPin, ChevronRight, Minus, Plus, Zap } from 'lucide-react';
import { useCalculator } from '../state/calculatorContext';
import { fetchPropertyData } from '../services/propertyApi';
import type { AddressSelection, ServiceId } from '../types/calculator';
import { buildSatelliteCandidates } from '../services/mapImageUtils';

export function CalcScreen2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isHydrated, addressSelection, selectedService, propertyData, setPropertyData, setQuote, setSelectedService, setAddressSelection } = useCalculator();
  const navState = (location.state || {}) as { selectedService?: ServiceId; addressSelection?: AddressSelection };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState(propertyData?.bedrooms || 3);
  const [bathrooms, setBathrooms] = useState(propertyData?.bathrooms || 2);
  const [size, setSize] = useState<'small' | 'medium' | 'large'>(propertyData?.sizeBand || 'medium');
  const [storeys, setStoreys] = useState<'single' | 'double'>(propertyData?.storeys || 'single');
  const [propType, setPropType] = useState<'house' | 'unit' | 'townhouse'>(propertyData?.propertyType || 'house');
  const [imageIndex, setImageIndex] = useState(0);
  const [mapLat, setMapLat] = useState<number | null>(propertyData?.lat || null);
  const [mapLng, setMapLng] = useState<number | null>(propertyData?.lng || null);
  const [mapStep, setMapStep] = useState(0.0012);
  const [mapZoom, setMapZoom] = useState(3);
  const [baseLat, setBaseLat] = useState<number | null>(propertyData?.lat || null);
  const [baseLng, setBaseLng] = useState<number | null>(propertyData?.lng || null);

  useEffect(() => {
    if (!isHydrated) return;
    if (!addressSelection?.placeId || !selectedService) {
      if (navState?.selectedService && navState?.addressSelection?.placeId) {
        setSelectedService(navState.selectedService);
        setAddressSelection(navState.addressSelection);
        return;
      }
      navigate('/calculator/1');
      return;
    }
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const result = await fetchPropertyData(addressSelection.placeId, selectedService);
        if (!mounted) return;
        setPropertyData(result.property);
        setQuote(result.quote);
        setBedrooms(result.property.bedrooms);
        setBathrooms(result.property.bathrooms);
        setSize(result.property.sizeBand);
        setStoreys(result.property.storeys);
        setPropType(result.property.propertyType);
        setImageIndex(0);
        setMapLat(result.property.lat);
        setMapLng(result.property.lng);
        setBaseLat(result.property.lat);
        setBaseLng(result.property.lng);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [addressSelection?.placeId, isHydrated, navState?.addressSelection, navState?.selectedService, navigate, selectedService, setAddressSelection, setPropertyData, setQuote, setSelectedService]);

  useEffect(() => {
    if (!propertyData) return;
    const hasChanges =
      propertyData.bedrooms !== bedrooms ||
      propertyData.bathrooms !== bathrooms ||
      propertyData.sizeBand !== size ||
      propertyData.storeys !== storeys ||
      propertyData.propertyType !== propType;

    if (!hasChanges) return;

    setPropertyData({
      ...propertyData,
      bedrooms,
      bathrooms,
      sizeBand: size,
      storeys,
      propertyType: propType,
    });
  }, [bathrooms, bedrooms, propType, propertyData, setPropertyData, size, storeys]);

  useEffect(() => {
    if (!propertyData || mapLat === null || mapLng === null) return;
    const nextUrls = buildSatelliteCandidates(mapLat, mapLng, mapZoom);
    const hasMapChanges =
      propertyData.lat !== mapLat ||
      propertyData.lng !== mapLng ||
      (propertyData.satelliteImageUrls?.[0] || propertyData.satelliteImageUrl) !== nextUrls[0];
    if (!hasMapChanges) return;
    setImageIndex(0);
    setPropertyData({
      ...propertyData,
      lat: mapLat,
      lng: mapLng,
      satelliteImageUrl: nextUrls[0],
      satelliteImageUrls: nextUrls,
    });
  }, [mapLat, mapLng, mapZoom, propertyData, setPropertyData]);

  const nudgeMap = (dLat: number, dLng: number) => {
    if (mapLat === null || mapLng === null) return;
    setMapLat(mapLat + dLat);
    setMapLng(mapLng + dLng);
  };

  return (
    <CalculatorShell step={2} screenHint="2">
      <div>
        {loading ? (
          /* Loading state — the anticipation moment */
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f0fafa', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', position: 'relative' }}>
              <MapPin size={28} color="#0E7C7B" />
              <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '3px solid #0E7C7B', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D2B4E', marginBottom: '0.5rem' }}>
              Looking up your property...
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Checking property records for<br />
              <strong style={{ color: '#0D2B4E' }}>{addressSelection?.formattedAddress || 'your selected property'}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem', maxWidth: 240, margin: '1.5rem auto 0' }}>
              {['Searching property database...', 'Checking council records...', 'Calculating home size...'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 13, color: '#6b7280', opacity: i === 0 ? 1 : 0.5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0E7C7B' }} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div>
            <p style={{ color: '#b91c1c', fontSize: 14, marginBottom: '1rem' }}>{error}</p>
            <button className="btn-teal" style={{ width: '100%' }} onClick={() => navigate('/calculator/1')}>
              Go back
            </button>
          </div>
        ) : (
          /* Wow moment reveal */
          <div className="animate-fade-in">
            {/* Success header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.875rem 1rem', background: '#f0fafa', borderRadius: '0.875rem', border: '1px solid #c6e9e9' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0E7C7B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={18} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0D2B4E' }}>We found your home</div>
                <div style={{ fontSize: 12, color: '#0E7C7B' }}>{propertyData?.formattedAddress || addressSelection?.formattedAddress}</div>
                {addressSelection?.matchQuality === 'near' && (
                  <div style={{ fontSize: 11, color: '#b45309' }}>Nearest available address used</div>
                )}
              </div>
              <CheckCircle size={20} color="#0E7C7B" style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </div>

            {/* Satellite image */}
            <div style={{ borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.25rem', position: 'relative', height: 160, background: '#e5e7eb' }}>
              {(propertyData?.satelliteImageUrls?.[imageIndex] || propertyData?.satelliteImageUrl) && (
                <img
                  src={propertyData?.satelliteImageUrls?.[imageIndex] || propertyData?.satelliteImageUrl}
                  alt="Property satellite view"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => {
                    const count = propertyData?.satelliteImageUrls?.length || 0;
                    if (count > 1 && imageIndex < count - 1) setImageIndex((idx) => idx + 1);
                  }}
                />
              )}
              <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: '0.375rem', padding: '2px 8px', color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>
                Satellite View
              </div>
            </div>
            <div style={{ background: '#f8fffe', border: '1px solid #e0f2f1', borderRadius: '0.75rem', padding: '0.625rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: '0.5rem' }}>Need exact home focus? Adjust pin manually.</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 28px)', gap: '0.25rem' }}>
                  <div />
                  <button onClick={() => nudgeMap(mapStep, 0)} style={{ border: '1px solid #d1d5db', borderRadius: 6, background: 'white', cursor: 'pointer' }}>↑</button>
                  <div />
                  <button onClick={() => nudgeMap(0, -mapStep)} style={{ border: '1px solid #d1d5db', borderRadius: 6, background: 'white', cursor: 'pointer' }}>←</button>
                  <button onClick={() => { if (baseLat !== null && baseLng !== null) { setMapLat(baseLat); setMapLng(baseLng); } }} style={{ border: '1px solid #d1d5db', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 10 }}>•</button>
                  <button onClick={() => nudgeMap(0, mapStep)} style={{ border: '1px solid #d1d5db', borderRadius: 6, background: 'white', cursor: 'pointer' }}>→</button>
                  <div />
                  <button onClick={() => nudgeMap(-mapStep, 0)} style={{ border: '1px solid #d1d5db', borderRadius: 6, background: 'white', cursor: 'pointer' }}>↓</button>
                  <div />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontSize: 11, color: '#6b7280' }}>Zoom</span>
                  <button
                    onClick={() => {
                      setMapZoom((z) => Math.max(1, z - 1));
                      setMapStep((v) => Math.min(0.0025, v * 1.5));
                    }}
                    style={{ border: '1px solid #d1d5db', borderRadius: 6, background: 'white', cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <button
                    onClick={() => {
                      setMapZoom((z) => Math.min(6, z + 1));
                      setMapStep((v) => Math.max(0.00005, v / 1.5));
                    }}
                    style={{ border: '1px solid #d1d5db', borderRadius: 6, background: 'white', cursor: 'pointer' }}
                  >
                    +
                  </button>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>x{mapZoom}</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              ✨ We pre-filled these from your property records. Please check they look right — tap any card to adjust.
            </p>

            {/* Editable property cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

              {/* Bedrooms */}
              <div className="wow-item" style={{ background: 'white', borderRadius: '0.875rem', padding: '0.875rem 1rem', border: '1px solid #e0f2f1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ fontSize: 20 }}>🛏️</span>
                  <div>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bedrooms</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>{bedrooms}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => setBedrooms(Math.max(1, bedrooms - 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ width: 24, textAlign: 'center', fontWeight: 700, color: '#0D2B4E' }}>{bedrooms}</span>
                  <button onClick={() => setBedrooms(Math.min(8, bedrooms + 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #0E7C7B', background: '#f0fafa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0E7C7B' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Bathrooms */}
              <div className="wow-item" style={{ background: 'white', borderRadius: '0.875rem', padding: '0.875rem 1rem', border: '1px solid #e0f2f1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ fontSize: 20 }}>🚿</span>
                  <div>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bathrooms</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0D2B4E' }}>{bathrooms}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => setBathrooms(Math.max(1, bathrooms - 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #e5e7eb', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ width: 24, textAlign: 'center', fontWeight: 700, color: '#0D2B4E' }}>{bathrooms}</span>
                  <button onClick={() => setBathrooms(Math.min(6, bathrooms + 1))} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #0E7C7B', background: '#f0fafa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0E7C7B' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Home Size */}
              <div className="wow-item" style={{ background: 'white', borderRadius: '0.875rem', padding: '0.875rem 1rem', border: '1px solid #e0f2f1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 20 }}>📐</span>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Home Size</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { id: 'small', label: 'Small', sub: 'Under 100m²' },
                    { id: 'medium', label: 'Medium', sub: '100–200m²' },
                    { id: 'large', label: 'Large', sub: 'Over 200m²' },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setSize(opt.id as any)}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '0.625rem', border: size === opt.id ? '2px solid #0E7C7B' : '2px solid #e5e7eb', background: size === opt.id ? '#f0fafa' : 'white', cursor: 'pointer', textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: size === opt.id ? '#0E7C7B' : '#0D2B4E' }}>{opt.label}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af' }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Storeys */}
              <div className="wow-item" style={{ background: 'white', borderRadius: '0.875rem', padding: '0.875rem 1rem', border: '1px solid #e0f2f1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 20 }}>⬆️</span>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Storeys</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['single', 'double'].map(opt => (
                    <button key={opt} onClick={() => setStoreys(opt as any)}
                      style={{ flex: 1, padding: '0.625rem', borderRadius: '0.625rem', border: storeys === opt ? '2px solid #0E7C7B' : '2px solid #e5e7eb', background: storeys === opt ? '#f0fafa' : 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: storeys === opt ? '#0E7C7B' : '#374151', textTransform: 'capitalize' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="wow-item" style={{ background: 'white', borderRadius: '0.875rem', padding: '0.875rem 1rem', border: '1px solid #e0f2f1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 20 }}>🏠</span>
                  <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property Type</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['house', 'unit', 'townhouse'].map(opt => (
                    <button key={opt} onClick={() => setPropType(opt as any)}
                      style={{ padding: '0.5rem 0.875rem', borderRadius: '2rem', border: propType === opt ? '2px solid #0E7C7B' : '2px solid #e5e7eb', background: propType === opt ? '#f0fafa' : 'white', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: propType === opt ? '#0E7C7B' : '#374151', textTransform: 'capitalize' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn-teal" style={{ width: '100%', fontSize: 16, padding: '1rem' }} onClick={() => navigate('/calculator/3')}>
              Looks Right — Get My Quote <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
