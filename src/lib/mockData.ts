import { AirportInfo, AirlineInfo, FlightOffer, PNRRecord, AgentWallet } from '@/types/travel';

export const AIRPORTS: Record<string, AirportInfo> = {
  BOM: { iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai', country: 'India' },
  DEL: { iataCode: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India' },
  BLR: { iataCode: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', country: 'India' },
  DXB: { iataCode: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'United Arab Emirates' },
  SIN: { iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  LHR: { iataCode: 'LHR', name: 'London Heathrow', city: 'London', country: 'United Kingdom' },
  JFK: { iataCode: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'United States' },
  DOH: { iataCode: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar' },
  CDG: { iataCode: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  FRA: { iataCode: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  NRT: { iataCode: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
  SYD: { iataCode: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
};

export const AIRLINES: Record<string, AirlineInfo> = {
  EK: { code: 'EK', name: 'Emirates' },
  FZ: { code: 'FZ', name: 'flydubai' },
  AI: { code: 'AI', name: 'Air India' },
  '6E': { code: '6E', name: 'IndiGo' },
  SQ: { code: 'SQ', name: 'Singapore Airlines' },
  BA: { code: 'BA', name: 'British Airways' },
  QR: { code: 'QR', name: 'Qatar Airways' },
  LH: { code: 'LH', name: 'Lufthansa' },
  VS: { code: 'VS', name: 'Virgin Atlantic' },
};

export const SAMPLE_PROMPTS = [
  {
    id: 'sample-1',
    label: 'Corporate Urgent (BOM ➔ DXB)',
    text: 'Book 2 seats BOM to DXB next Tuesday, morning flight, Emirates or Flydubai preferred, budget ₹50k, vegetarian meal',
    origin: 'BOM',
    destination: 'DXB',
  },
  {
    id: 'sample-2',
    label: 'Family Vacation (DEL ➔ SIN)',
    text: 'Family vacation round-trip for 4 passengers DEL to SIN departing 24th Oct, returning 31st Oct. Singapore Airlines preferred, economy class, kid meals requested.',
    origin: 'DEL',
    destination: 'SIN',
  },
  {
    id: 'sample-3',
    label: 'Executive Business (BLR ➔ LHR)',
    text: 'Urgent corporate travel BLR to LHR for 1 executive. British Airways or Air India, Business class, morning departure, aisle seat, extra baggage allowance.',
    origin: 'BLR',
    destination: 'LHR',
  },
];

export const INITIAL_AGENT_WALLET: AgentWallet = {
  currency: 'USD',
  creditLimit: 50000,
  usedCredit: 25000,
  availableCredit: 25000,
  pendingSettlement: 4200,
};

// Generates realistic mock flight offers matching origin, destination, and dates
export function generateMockFlights(
  originIata: string = 'BOM',
  destinationIata: string = 'DXB',
  departureDate: string = '2026-10-18',
  cabinClass: 'Y' | 'W' | 'J' | 'F' = 'Y'
): FlightOffer[] {
  const origin = AIRPORTS[originIata.toUpperCase()] || {
    iataCode: originIata.toUpperCase(),
    name: `${originIata.toUpperCase()} International`,
    city: originIata.toUpperCase(),
    country: 'Global',
  };

  const dest = AIRPORTS[destinationIata.toUpperCase()] || {
    iataCode: destinationIata.toUpperCase(),
    name: `${destinationIata.toUpperCase()} International`,
    city: destinationIata.toUpperCase(),
    country: 'Global',
  };

  const isBusiness = cabinClass === 'J';
  const fareMultiplier = isBusiness ? 3.5 : cabinClass === 'W' ? 1.8 : cabinClass === 'F' ? 6.0 : 1.0;

  // Primary Direct Flight 1: Emirates
  const offer1: FlightOffer = {
    id: `offer-${origin.iataCode}-${dest.iataCode}-EK501`,
    validatingAirline: AIRLINES.EK,
    totalDurationMinutes: 195, // 3h 15m
    stopsCount: 0,
    baseFareNet: Math.round(18500 * fareMultiplier),
    taxAndFees: Math.round(3400 * fareMultiplier),
    totalNetFare: Math.round(21900 * fareMultiplier),
    currency: 'INR',
    availableSeats: 7,
    fareBasisCode: isBusiness ? 'JBIZPRO' : 'YFLEXOW',
    isRefundable: true,
    mealIncluded: true,
    outboundSegments: [
      {
        segmentId: 'seg-1',
        airline: AIRLINES.EK,
        flightNumber: 'EK 501',
        aircraft: 'Boeing 777-300ER',
        origin: origin,
        destination: dest,
        departureTime: `${departureDate}T04:30:00`,
        arrivalTime: `${departureDate}T06:45:00`,
        durationMinutes: 195,
        cabinClass: cabinClass,
        cabinClassName: isBusiness ? 'Business' : 'Economy',
        baggage: {
          cabin: '7 kg',
          checkIn: isBusiness ? '40 kg (2 pcs)' : '30 kg (2 pcs)',
        },
      },
    ],
  };

  // Primary Direct Flight 2: Flydubai / Air India
  const airline2 = origin.iataCode === 'DEL' ? AIRLINES.AI : AIRLINES.FZ;
  const offer2: FlightOffer = {
    id: `offer-${origin.iataCode}-${dest.iataCode}-FZ442`,
    validatingAirline: airline2,
    totalDurationMinutes: 210,
    stopsCount: 0,
    baseFareNet: Math.round(14200 * fareMultiplier),
    taxAndFees: Math.round(2800 * fareMultiplier),
    totalNetFare: Math.round(17000 * fareMultiplier),
    currency: 'INR',
    availableSeats: 12,
    fareBasisCode: isBusiness ? 'JVALUE' : 'YSAVER',
    isRefundable: false,
    mealIncluded: isBusiness,
    outboundSegments: [
      {
        segmentId: 'seg-2',
        airline: airline2,
        flightNumber: airline2.code === 'FZ' ? 'FZ 442' : 'AI 995',
        aircraft: 'Boeing 737 MAX 8',
        origin: origin,
        destination: dest,
        departureTime: `${departureDate}T09:15:00`,
        arrivalTime: `${departureDate}T11:45:00`,
        durationMinutes: 210,
        cabinClass: cabinClass,
        cabinClassName: isBusiness ? 'Business' : 'Economy',
        baggage: {
          cabin: '7 kg',
          checkIn: isBusiness ? '35 kg' : '20 kg',
        },
      },
    ],
  };

  // 1-Stop Connecting Flight: Qatar Airways / Singapore Airlines
  const transitIata = origin.iataCode === 'BOM' || dest.iataCode === 'DXB' ? 'DOH' : 'SIN';
  const transitAirport = AIRPORTS[transitIata] || AIRPORTS.DOH;
  const offer3: FlightOffer = {
    id: `offer-${origin.iataCode}-${dest.iataCode}-QR557`,
    validatingAirline: AIRLINES.QR,
    totalDurationMinutes: 380, // 6h 20m with layover
    stopsCount: 1,
    baseFareNet: Math.round(16800 * fareMultiplier),
    taxAndFees: Math.round(3100 * fareMultiplier),
    totalNetFare: Math.round(19900 * fareMultiplier),
    currency: 'INR',
    availableSeats: 4,
    fareBasisCode: isBusiness ? 'JELITE' : 'YSTANDARD',
    isRefundable: true,
    mealIncluded: true,
    outboundSegments: [
      {
        segmentId: 'seg-3a',
        airline: AIRLINES.QR,
        flightNumber: 'QR 557',
        aircraft: 'Airbus A350-900',
        origin: origin,
        destination: transitAirport,
        departureTime: `${departureDate}T06:10:00`,
        arrivalTime: `${departureDate}T07:40:00`,
        durationMinutes: 210,
        cabinClass: cabinClass,
        cabinClassName: isBusiness ? 'Business' : 'Economy',
        baggage: { cabin: '7 kg', checkIn: isBusiness ? '40 kg' : '25 kg' },
        layoverAfterMinutes: 80,
      },
      {
        segmentId: 'seg-3b',
        airline: AIRLINES.QR,
        flightNumber: 'QR 102',
        aircraft: 'Boeing 787-9 Dreamliner',
        origin: transitAirport,
        destination: dest,
        departureTime: `${departureDate}T09:00:00`,
        arrivalTime: `${departureDate}T11:20:00`,
        durationMinutes: 90,
        cabinClass: cabinClass,
        cabinClassName: isBusiness ? 'Business' : 'Economy',
        baggage: { cabin: '7 kg', checkIn: isBusiness ? '40 kg' : '25 kg' },
      },
    ],
  };

  // Direct Premium Evening Flight
  const offer4: FlightOffer = {
    id: `offer-${origin.iataCode}-${dest.iataCode}-EK505`,
    validatingAirline: AIRLINES.EK,
    totalDurationMinutes: 195,
    stopsCount: 0,
    baseFareNet: Math.round(20400 * fareMultiplier),
    taxAndFees: Math.round(3600 * fareMultiplier),
    totalNetFare: Math.round(24000 * fareMultiplier),
    currency: 'INR',
    availableSeats: 9,
    fareBasisCode: isBusiness ? 'JCOMFORT' : 'YFLEXPLUS',
    isRefundable: true,
    mealIncluded: true,
    outboundSegments: [
      {
        segmentId: 'seg-4',
        airline: AIRLINES.EK,
        flightNumber: 'EK 505',
        aircraft: 'Airbus A380-800',
        origin: origin,
        destination: dest,
        departureTime: `${departureDate}T19:20:00`,
        arrivalTime: `${departureDate}T21:35:00`,
        durationMinutes: 195,
        cabinClass: cabinClass,
        cabinClassName: isBusiness ? 'Business' : 'Economy',
        baggage: {
          cabin: '7 kg',
          checkIn: isBusiness ? '40 kg' : '35 kg',
        },
      },
    ],
  };

  return [offer1, offer2, offer3, offer4];
}

// Pre-seeded PNR Ledger
export const INITIAL_PNR_LEDGER: PNRRecord[] = [
  {
    pnr: '6X9B2K',
    createdAt: '2026-10-10T14:30:00Z',
    status: 'Ticketed',
    clientName: 'Rahul Sharma',
    clientEmail: 'rahul.s@tata-corp.com',
    companyName: 'Tata Consultancy Services',
    originIata: 'BOM',
    destinationIata: 'DXB',
    departureDate: '2026-10-18',
    passengerCount: 2,
    selectedOffer: generateMockFlights('BOM', 'DXB', '2026-10-18', 'Y')[0],
    markup: { mode: 'percentage', value: 8 },
    priceBreakdown: {
      netAirlineFare: 43800,
      agencyMarkup: 3504,
      grossClientFare: 47304,
      currency: 'INR',
    },
    specialRequests: 'Vegetarian Hindu Meal (AVML), Window seats preferred',
  },
  {
    pnr: 'TR7P4M',
    createdAt: '2026-10-11T09:15:00Z',
    status: 'Quoted',
    clientName: 'Priya Iyer',
    clientEmail: 'priya.iyer@fintech-asia.io',
    companyName: 'Fintech Asia Pte',
    originIata: 'DEL',
    destinationIata: 'SIN',
    departureDate: '2026-10-24',
    passengerCount: 4,
    selectedOffer: generateMockFlights('DEL', 'SIN', '2026-10-24', 'Y')[1],
    markup: { mode: 'flat', value: 1500 },
    priceBreakdown: {
      netAirlineFare: 68000,
      agencyMarkup: 6000,
      grossClientFare: 74000,
      currency: 'INR',
    },
    specialRequests: 'Kid Meals, 1 Baby Bassinet Seat row 12',
  },
  {
    pnr: 'EK9A1Z',
    createdAt: '2026-10-11T12:00:00Z',
    status: 'Confirmed',
    clientName: 'Anand Mahindra',
    clientEmail: 'exec.desk@mahindra.com',
    companyName: 'Mahindra Holdings',
    originIata: 'BLR',
    destinationIata: 'LHR',
    departureDate: '2026-10-28',
    passengerCount: 1,
    selectedOffer: generateMockFlights('BLR', 'LHR', '2026-10-28', 'J')[0],
    markup: { mode: 'percentage', value: 12 },
    priceBreakdown: {
      netAirlineFare: 165000,
      agencyMarkup: 19800,
      grossClientFare: 184800,
      currency: 'INR',
    },
    specialRequests: 'Business Class Lie-Flat, Fast Track Immigration Pass, Kosher Meal',
  },
  {
    pnr: 'SQ3D8Q',
    createdAt: '2026-10-11T16:45:00Z',
    status: 'Draft',
    clientName: 'Vikram Mehta',
    clientEmail: 'v.mehta@reliance-infra.in',
    companyName: 'Reliance Industries',
    originIata: 'DEL',
    destinationIata: 'DXB',
    departureDate: '2026-11-02',
    passengerCount: 3,
    selectedOffer: generateMockFlights('DEL', 'DXB', '2026-11-02', 'Y')[1],
    markup: { mode: 'percentage', value: 6 },
    priceBreakdown: {
      netAirlineFare: 51000,
      agencyMarkup: 3060,
      grossClientFare: 54060,
      currency: 'INR',
    },
    specialRequests: 'Extra legroom seats, invoice billed to Corporate GSTIN',
  },
];
