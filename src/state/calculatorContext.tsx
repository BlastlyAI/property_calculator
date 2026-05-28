import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AddressSelection, PropertyData, QuoteRange, ServiceAnswers, ServiceId } from "../types/calculator";
import type { ServiceConfig } from "../types/calculator";
import { fetchServiceConfigs } from "../services/propertyApi";

interface CalculatorContextShape {
  isHydrated: boolean;
  selectedService: ServiceId | null;
  addressSelection: AddressSelection | null;
  propertyData: PropertyData | null;
  quote: QuoteRange | null;
  serviceConfigs: ServiceConfig[];
  answers: ServiceAnswers;
  setSelectedService: (service: ServiceId) => void;
  setAddressSelection: (address: AddressSelection) => void;
  setPropertyData: (property: PropertyData) => void;
  setQuote: (quote: QuoteRange) => void;
  updateAnswers: (service: ServiceId, nextAnswers: ServiceAnswers[ServiceId]) => void;
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

  const value = useMemo<CalculatorContextShape>(
    () => ({
      selectedService,
      isHydrated,
      addressSelection,
      propertyData,
      quote,
      serviceConfigs,
      answers,
      setSelectedService,
      setAddressSelection,
      setPropertyData,
      setQuote,
      updateAnswers: (service, nextAnswers) =>
        setAnswers((prev) => ({ ...prev, [service]: { ...(prev[service] || {}), ...(nextAnswers || {}) } })),
    }),
    [selectedService, isHydrated, addressSelection, propertyData, quote, serviceConfigs, answers],
  );

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used inside CalculatorProvider");
  return ctx;
}

