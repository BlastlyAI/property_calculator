import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { CalculatorShell } from './components/CalculatorShell';
import { ChevronRight, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { useCalculator } from '../state/calculatorContext';
import { confirmPayment, createPaymentIntent } from '../services/paymentApi';

function PaymentForm({
  bookingId,
  amountAud,
  onPaid,
}: {
  bookingId: string;
  amountAud: number;
  onPaid: (paymentIntentId: string) => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setPaying(true);
    setError(null);
    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });
      if (result.error) {
        setError(result.error.message || 'Payment failed');
        return;
      }
      const paymentIntentId = result.paymentIntent?.id;
      if (!paymentIntentId) {
        setError('Payment did not complete. Please try again.');
        return;
      }
      await onPaid(paymentIntentId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div>
      <div style={{ background: '#fbfdfd', border: '1px solid #e7eef0', borderRadius: '0.9rem', padding: '0.85rem', marginBottom: '1rem' }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      <button
        className="btn-gold"
        disabled={!stripe || !elements || paying}
        style={{ width: '100%', fontSize: 16, padding: '1rem' }}
        onClick={handlePay}
      >
        {paying ? 'Processing payment...' : `Pay $${amountAud} deposit`} {!paying && <ChevronRight size={18} />}
      </button>
      {error && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#b91c1c', marginTop: '0.5rem' }}>{error}</p>
      )}
      <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: '0.5rem' }}>
        Sandbox test card: 4242 4242 4242 4242 · any future expiry · any CVC
      </p>
    </div>
  );
}

export function CalcPayment() {
  const navigate = useNavigate();
  const { activeBooking, quote, selectedService, propertyData, customerEmail, scheduleSummary, setPaymentResult } = useCalculator();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [depositAud, setDepositAud] = useState<number>(0);

  useEffect(() => {
    if (!activeBooking?.id) {
      navigate('/calculator/5');
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const session = await createPaymentIntent(activeBooking.id, customerEmail || undefined);
        setPublishableKey(session.publishableKey);
        setDepositAud(session.depositAud);
        if (session.alreadyPaid) {
          setPaymentResult({ bookingId: activeBooking.id, amountCents: session.amountCents, status: 'succeeded' });
          navigate('/calculator/confirm');
          return;
        }
        if (!session.clientSecret) throw new Error('Missing payment session');
        setClientSecret(session.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to start payment');
      } finally {
        setLoading(false);
      }
    })();
  }, [activeBooking?.id, customerEmail, navigate, setPaymentResult]);

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey],
  );

  const handlePaid = async (paymentIntentId: string) => {
    if (!activeBooking?.id) return;
    const result = await confirmPayment(activeBooking.id, paymentIntentId);
    setPaymentResult({
      bookingId: activeBooking.id,
      bookingReference: result.booking.booking_reference,
      amountCents: result.payment.amountCents,
      status: result.payment.status,
      paidAt: result.booking.paid_at,
    });
    navigate('/calculator/confirm');
  };

  return (
    <CalculatorShell step={5} screenHint="payment">
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0D2B4E', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
          Secure payment
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: '1rem', lineHeight: 1.45 }}>
          Complete your {(selectedService || 'house')} booking deposit to confirm your spot.
        </p>

        <div style={{ background: 'linear-gradient(180deg, #f4fcfc 0%, #edf8f8 100%)', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem', border: '1px solid #c6e9e9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#0E7C7B', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <CreditCard size={14} /> Payment summary
          </div>
          {[
            { label: 'Booking ref', value: activeBooking?.booking_reference || '—' },
            { label: 'Address', value: propertyData?.formattedAddress || '—' },
            { label: 'Estimate range', value: `$${quote?.low || 0}-${quote?.high || 0}` },
            { label: 'Deposit due now', value: `$${depositAud || quote?.low || 0}` },
            { label: 'Scheduled', value: scheduleSummary ? `${scheduleSummary.dateLabel}, ${scheduleSummary.time}` : '—' },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: '#6b7280' }}>{row.label}</span>
              <span style={{ fontWeight: 600, color: '#0D2B4E', textAlign: 'right', maxWidth: '62%' }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0E7C7B', background: '#f0fafa', border: '1px solid #c6e9e9', borderRadius: 999, padding: '0.25rem 0.6rem' }}>
            <Lock size={12} /> Stripe secure checkout
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0E7C7B', background: '#f0fafa', border: '1px solid #c6e9e9', borderRadius: 999, padding: '0.25rem 0.6rem' }}>
            <ShieldCheck size={12} /> Test mode enabled
          </span>
        </div>

        {loading && (
          <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280', padding: '2rem 0' }}>Preparing secure payment...</p>
        )}
        {!loading && error && (
          <div>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#b91c1c', marginBottom: '0.75rem' }}>{error}</p>
            <button className="btn-teal" style={{ width: '100%' }} onClick={() => window.location.reload()}>
              Retry payment setup
            </button>
          </div>
        )}
        {!loading && !error && clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#0E7C7B' } } }}>
            <PaymentForm bookingId={activeBooking!.id} amountAud={depositAud} onPaid={handlePaid} />
          </Elements>
        )}
      </div>
    </CalculatorShell>
  );
}
