import type { ApiResponse, PropertyData, QuoteRange, ServiceAnswers, ServiceConfig, ServiceId } from "../types/calculator";

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  formattedAddress?: string;
  lat?: number | null;
  lng?: number | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  provider?: string;
  matchQuality?: "exact" | "near";
}

export async function fetchAddressPredictions(input: string): Promise<PlacePrediction[]> {
  const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}`);
  if (!res.ok) throw new Error("Failed to fetch address suggestions");
  const data: ApiResponse<{ predictions: PlacePrediction[] }> = await res.json();
  if (!data.success || !data.data) throw new Error(data.error?.message || "Failed to fetch address suggestions");
  return data.data.predictions || [];
}

export async function resolveAddressFromText(input: string): Promise<PlacePrediction> {
  const res = await fetch(`/api/places/resolve-text?input=${encodeURIComponent(input)}`);
  if (!res.ok) throw new Error("Failed to resolve typed address");
  const data: ApiResponse<{ address: PlacePrediction }> = await res.json();
  if (!data.success || !data.data) throw new Error(data.error?.message || "Failed to resolve typed address");
  return data.data.address;
}

export async function fetchPropertyData(placeId: string, service: ServiceId): Promise<{ property: PropertyData; quote: QuoteRange }> {
  const res = await fetch(`/api/property-data?placeId=${encodeURIComponent(placeId)}&service=${service}`);
  if (!res.ok) throw new Error("Failed to load property data");
  const data: ApiResponse<{ property: PropertyData; quote: QuoteRange }> = await res.json();
  if (!data.success || !data.data) throw new Error(data.error?.message || "Failed to load property data");
  return data.data;
}

export async function fetchQuote(serviceId: ServiceId, property: PropertyData, answers: ServiceAnswers[ServiceId]): Promise<QuoteRange> {
  const res = await fetch("/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serviceId, property, answers }),
  });
  if (!res.ok) throw new Error("Failed to calculate quote");
  const data: ApiResponse<{ quote: QuoteRange }> = await res.json();
  if (!data.success || !data.data) throw new Error(data.error?.message || "Failed to calculate quote");
  return data.data.quote;
}

export async function fetchServiceConfigs(): Promise<ServiceConfig[]> {
  const res = await fetch("/api/service-configs");
  if (!res.ok) throw new Error("Failed to load service config");
  const data: ApiResponse<{ services: ServiceConfig[] }> = await res.json();
  if (!data.success || !data.data) throw new Error(data.error?.message || "Failed to load service config");
  return data.data.services;
}

