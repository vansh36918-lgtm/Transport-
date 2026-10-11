// Domain Types for AirOps Copilot TravelTech System

export type FareClassCode = 'Y' | 'W' | 'J' | 'F';

export interface FareClassDetails {
  code: FareClassCode;
  name: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  description: string;
}

export interface AirportInfo {
  iataCode: string;
  name: string;
  city: string;
  country: string;
  timezone?: string;
}

export interface AirlineInfo {
  code: string; // e.g. "EK", "FZ", "AI", "6E", "SQ", "BA"
  name: string;
  logoUrl?: string;
}

export interface FlightSegment {
  segmentId: string;
  airline: AirlineInfo;
  flightNumber: string; // e.g. "EK 501"
  aircraft?: string; // e.g. "Boeing 777-300ER", "Airbus A350-900"
  origin: AirportInfo;
  destination: AirportInfo;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  durationMinutes: number;
  cabinClass: FareClassCode;
  cabinClassName: string;
  baggage: {
    cabin: string; // e.g. "7 kg"
    checkIn: string; // e.g. "30 kg (2 pcs)"
  };
  layoverAfterMinutes?: number;
}

export interface FlightOffer {
  id: string;
  validatingAirline: AirlineInfo;
  outboundSegments: FlightSegment[];
  returnSegments?: FlightSegment[];
  totalDurationMinutes: number;
  stopsCount: number; // 0 = Direct, 1 = 1 Stop, etc.
  baseFareNet: number; // Wholesale GDS Net Cost
  taxAndFees: number;
  totalNetFare: number;
  currency: string;
  availableSeats: number;
  fareBasisCode: string; // e.g. "YFLEXOW", "JBIZPRO"
  isRefundable: boolean;
  mealIncluded: boolean;
}

export interface ParsedTravelRequest {
  rawText: string;
  originIata: string;
  originCity: string;
  destinationIata: string;
  destinationCity: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  tripType: 'one-way' | 'round-trip' | 'multi-city';
  passengersCount: number;
  preferredAirlines: string[];
  maxBudgetINR?: number;
  cabinClass: FareClassCode;
  specialRequests: {
    mealPreference?: string;
    seatPreference?: string;
    isUrgent?: boolean;
    corporateTag?: string;
    notes?: string;
  };
  confidenceScore: number;
  extractionMethod: 'llm-gemini' | 'llm-openai' | 'heuristic-regex';
}

export interface MarkupSettings {
  mode: 'percentage' | 'flat';
  value: number; // e.g. 8 for 8%, or 1500 for flat 1500
}

export interface PriceBreakdown {
  netAirlineFare: number;
  agencyMarkup: number;
  grossClientFare: number;
  currency: string;
}

export type PNRStatus = 'Draft' | 'Quoted' | 'Confirmed' | 'Ticketed';

export interface PNRRecord {
  pnr: string; // 6-character alphanumeric e.g. "6X9B2K"
  createdAt: string;
  status: PNRStatus;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  companyName?: string;
  originIata: string;
  destinationIata: string;
  departureDate: string;
  returnDate?: string;
  passengerCount: number;
  selectedOffer: FlightOffer;
  markup: MarkupSettings;
  priceBreakdown: PriceBreakdown;
  specialRequests?: string;
  rawRequestText?: string;
}

export interface AgentWallet {
  currency: string;
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
  pendingSettlement: number;
}
