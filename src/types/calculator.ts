export type ServiceId = "house" | "carpet" | "windows";

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, unknown>;
}

export interface AddressSelection {
  placeId: string;
  formattedAddress: string;
  lat?: number | null;
  lng?: number | null;
  suburb?: string | null;
  state?: string | null;
  postcode?: string | null;
  provider?: string;
  matchQuality?: "exact" | "near";
}

export interface PropertyData {
  placeId: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  satelliteImageUrl: string;
  satelliteImageUrls?: string[];
  propertyType: "house" | "unit" | "townhouse";
  sizeBand: "small" | "medium" | "large";
  bedrooms: number;
  bathrooms: number;
  houseSizeSqm: number;
  landSizeSqm: number;
  gardenSizeSqm?: number;
  storeys: "single" | "double";
  windowEstimate: number;
  carpetedRoomsEstimate?: number;
  hasPool?: boolean;
  poolSizeSqm?: number;
  occupancyCategory?: string;
  isResidential?: boolean;
  estimationMeta?: {
    confidenceScore?: "high" | "medium" | "low";
    density?: string;
    estimatedFrom?: string[];
    signalsUsed?: string[];
    footprintSqm?: number;
    builtAreaSqm?: number;
  };
  cacheHit?: boolean;
  provider?: string;
}

export interface QuoteRange {
  low: number;
  high: number;
}

export interface ServiceAnswers {
  [serviceId: string]: Record<string, unknown> | undefined;
}

export interface ServiceOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  priceLabel?: string;
}

export interface ServiceQuestion {
  id: string;
  label: string;
  type: "gridCards" | "binaryCards" | "multiSelectList" | "counter" | "singleList" | "binaryPills";
  options?: ServiceOption[];
  defaultFromProperty?: keyof PropertyData;
  min?: number;
  max?: number;
  unitLabel?: string;
  helperText?: string;
}

export interface ServiceConfig {
  id: ServiceId;
  title: string;
  description: string;
  startingFromLabel: string;
  icon: string;
  questions: ServiceQuestion[];
  quoteRules: Record<string, unknown>;
}

