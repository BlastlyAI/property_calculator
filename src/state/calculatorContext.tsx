import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  ActiveBooking,
  AddressSelection,
  PropertyData,
  QuoteRange,
  ScheduleSummary,
  ServiceAnswers,
  ServiceId,
} from "../types/calculator";
import type { ServiceConfig } from "../types/calculator";
import { fetchServiceConfigs } from "../services/propertyApi";
import { trackLead } from "../services/leadApi";

export interface PaymentResultState {
  bookingId: string;
  bookingReference?: string;
  amountCents: number;
  status: string;
  paidAt?: string | null;
}

interface CalculatorContextShape {
  isHydrated: boolean;
  selectedService: ServiceId | null;
  addressSelection: AddressSelection | null;
  propertyData: PropertyData | null;
  quote: QuoteRange | null;
  serviceConfigs: ServiceConfig[];
  answers: ServiceAnswers;
  activeBooking: ActiveBooking | null;
  customerEmail: string | null;
  scheduleSummary: ScheduleSummary | null;
  paymentResult: PaymentResultState | null;
  setSelectedService: (service: ServiceId) => void;
  setAddressSelection: (address: AddressSelection) => void;
  setPropertyData: (property: PropertyData) => void;
  setQuote: (quote: QuoteRange) => void;
  updateAnswers: (service: ServiceId, nextAnswers: ServiceAnswers[ServiceId]) => void;
  setActiveBooking: (booking: ActiveBooking | null) => void;
  setCustomerEmail: (email: string | null) => void;
  setScheduleSummary: (summary: ScheduleSummary | null) => void;
  setPaymentResult: (result: PaymentResultState | null) => void;
}

const KEY = "homesnap.calculator.state";
const CalculatorContext = createContext<CalculatorContextShape | null>(null);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [addressSelection, setAddressSelection] = useState<AddressSelection | null>(null);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [quote, setQuote] = useState<QuoteRange | null>(null);
  const [serviceConfigs, setServiceConfigs] = useState<ServiceConfig[]>([]);
  const [answers, setAnswers] = useState<ServiceAnswers>({});
  const [activeBooking, setActiveBooking] = useState<ActiveBooking | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [scheduleSummary, setScheduleSummary] = useState<ScheduleSummary | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResultState | null>(null);

  useEffect(() => {
    fetchServiceConfigs().then(setServiceConfigs).catch(() => setServiceConfigs([]));
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSelectedService(parsed.selectedService || null);
        setAddressSelection(parsed.addressSelection || null);
        setPropertyData(parsed.propertyData || null);
        setQuote(parsed.quote || null);
        setAnswers(parsed.answers || {});
      } catch {
        localStorage.removeItem(KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ selectedService, addressSelection, propertyData, quote, answers }),
    );
  }, [selectedService, addressSelection, propertyData, quote, answers]);

  useEffect(() => {
    if (!isHydrated) return;
    const progressStep = !selectedService ? 1 : !propertyData ? 2 : !quote ? 3 : 4;
    trackLead({
      progressStep,
      serviceId: selectedService,
      formattedAddress: propertyData?.formattedAddress || addressSelection?.formattedAddress || null,
      placeId: propertyData?.placeId || addressSelection?.placeId || null,
      quote,
      eventType: "calculator_progress",
      eventData: { hasAnswers: Boolean(selectedService && answers[selectedService]) },
    });
  }, [isHydrated, selectedService, addressSelection, propertyData, quote, answers]);

  const value = useMemo<CalculatorContextShape>(
    () => ({
      selectedService,
      isHydrated,
      addressSelection,
      propertyData,
      quote,
      serviceConfigs,
      answers,
      activeBooking,
      customerEmail,
      scheduleSummary,
      paymentResult,
      setSelectedService,
      setAddressSelection,
      setPropertyData,
      setQuote,
      updateAnswers: (service, nextAnswers) =>
        setAnswers((prev) => ({ ...prev, [service]: { ...(prev[service] || {}), ...(nextAnswers || {}) } })),
      setActiveBooking,
      setCustomerEmail,
      setScheduleSummary,
      setPaymentResult,
    }),
    [
      selectedService,
      isHydrated,
      addressSelection,
      propertyData,
      quote,
      serviceConfigs,
      answers,
      activeBooking,
      customerEmail,
      scheduleSummary,
      paymentResult,
    ],
  );

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used inside CalculatorProvider");
  return ctx;
}

