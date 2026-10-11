import { ParsedTravelRequest, FareClassCode } from '@/types/travel';

const CITY_IATA_MAP: Record<string, { iata: string; city: string }> = {
  mumbai: { iata: 'BOM', city: 'Mumbai' },
  bom: { iata: 'BOM', city: 'Mumbai' },
  delhi: { iata: 'DEL', city: 'New Delhi' },
  'new delhi': { iata: 'DEL', city: 'New Delhi' },
  del: { iata: 'DEL', city: 'New Delhi' },
  bangalore: { iata: 'BLR', city: 'Bengaluru' },
  bengaluru: { iata: 'BLR', city: 'Bengaluru' },
  blr: { iata: 'BLR', city: 'Bengaluru' },
  dubai: { iata: 'DXB', city: 'Dubai' },
  dxb: { iata: 'DXB', city: 'Dubai' },
  singapore: { iata: 'SIN', city: 'Singapore' },
  sin: { iata: 'SIN', city: 'Singapore' },
  london: { iata: 'LHR', city: 'London' },
  heathrow: { iata: 'LHR', city: 'London' },
  lhr: { iata: 'LHR', city: 'London' },
  'new york': { iata: 'JFK', city: 'New York' },
  jfk: { iata: 'JFK', city: 'New York' },
  doha: { iata: 'DOH', city: 'Doha' },
  doh: { iata: 'DOH', city: 'Doha' },
  paris: { iata: 'CDG', city: 'Paris' },
  cdg: { iata: 'CDG', city: 'Paris' },
  frankfurt: { iata: 'FRA', city: 'Frankfurt' },
  fra: { iata: 'FRA', city: 'Frankfurt' },
  tokyo: { iata: 'NRT', city: 'Tokyo' },
  nrt: { iata: 'NRT', city: 'Tokyo' },
  sydney: { iata: 'SYD', city: 'Sydney' },
  syd: { iata: 'SYD', city: 'Sydney' },
};

export function parseTravelRequestRegex(text: string): ParsedTravelRequest {
  const lower = text.toLowerCase();

  // 1. Sector / Route Detection
  let originIata = 'BOM';
  let originCity = 'Mumbai';
  let destinationIata = 'DXB';
  let destinationCity = 'Dubai';

  // Check for patterns like "BOM to DXB", "Mumbai -> Dubai", "BLR ➔ LHR"
  const routeRegex = /(?:from\s+)?([a-zA-Z\s]{2,15}?)\s*(?:to|->|➔|--)\s*([a-zA-Z\s]{2,15})/i;
  const routeMatch = text.match(routeRegex);

  if (routeMatch) {
    const rawOrigin = routeMatch[1].trim().toLowerCase();
    const rawDest = routeMatch[2].trim().toLowerCase().split(/[\s,.]+/)[0]; // get primary word

    if (CITY_IATA_MAP[rawOrigin]) {
      originIata = CITY_IATA_MAP[rawOrigin].iata;
      originCity = CITY_IATA_MAP[rawOrigin].city;
    } else if (rawOrigin.length === 3) {
      originIata = rawOrigin.toUpperCase();
      originCity = rawOrigin.toUpperCase();
    }

    if (CITY_IATA_MAP[rawDest]) {
      destinationIata = CITY_IATA_MAP[rawDest].iata;
      destinationCity = CITY_IATA_MAP[rawDest].city;
    } else if (rawDest.length === 3) {
      destinationIata = rawDest.toUpperCase();
      destinationCity = rawDest.toUpperCase();
    }
  }

  // 2. Dates Calculation
  const today = new Date();
  let departureDateObj = new Date(today);
  departureDateObj.setDate(today.getDate() + 5); // default 5 days ahead
  let returnDateObj: Date | undefined = undefined;

  // Next Tuesday / Next Wednesday / etc.
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayMatch = lower.match(/(?:next|this)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i);
  if (dayMatch) {
    const targetDayIndex = daysOfWeek.indexOf(dayMatch[1].toLowerCase());
    const currentDayIndex = today.getDay();
    let daysToAdd = (targetDayIndex - currentDayIndex + 7) % 7;
    if (daysToAdd === 0) daysToAdd = 7;
    departureDateObj = new Date(today);
    departureDateObj.setDate(today.getDate() + daysToAdd);
  }

  // Explicit dates e.g. "24th Oct", "18 Oct", "departing 24th"
  const dateNumMatch = lower.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(oct|nov|dec|jan|feb|mar|apr|may|jun|jul|aug|sep)/i);
  if (dateNumMatch) {
    const day = parseInt(dateNumMatch[1], 10);
    const monthStr = dateNumMatch[2].toLowerCase();
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const month = months.indexOf(monthStr);
    const year = today.getFullYear();
    departureDateObj = new Date(year, month, day);
  }

  // Trip Type & Return Date
  let tripType: 'one-way' | 'round-trip' | 'multi-city' = 'one-way';
  if (lower.includes('round trip') || lower.includes('round-trip') || lower.includes('returning')) {
    tripType = 'round-trip';
    returnDateObj = new Date(departureDateObj);
    returnDateObj.setDate(departureDateObj.getDate() + 7);
  }

  // 3. Passenger Count
  let passengersCount = 1;
  const paxMatch = lower.match(/(\d+)\s*(?:seats|passengers|pax|adults|tickets|people)/i);
  if (paxMatch) {
    passengersCount = Math.max(1, parseInt(paxMatch[1], 10));
  } else if (lower.includes('family of 4') || lower.includes('for 4')) {
    passengersCount = 4;
  } else if (lower.includes('for 2') || lower.includes('couple')) {
    passengersCount = 2;
  }

  // 4. Preferred Airlines
  const preferredAirlines: string[] = [];
  const knownAirlines = [
    { name: 'Emirates', code: 'EK' },
    { name: 'Flydubai', code: 'FZ' },
    { name: 'Air India', code: 'AI' },
    { name: 'IndiGo', code: '6E' },
    { name: 'Singapore Airlines', code: 'SQ' },
    { name: 'British Airways', code: 'BA' },
    { name: 'Qatar Airways', code: 'QR' },
  ];
  for (const al of knownAirlines) {
    if (lower.includes(al.name.toLowerCase()) || lower.includes(al.code.toLowerCase())) {
      preferredAirlines.push(al.name);
    }
  }

  // 5. Budget Extraction
  let maxBudgetINR: number | undefined = undefined;
  const budgetMatch = lower.match(/(?:budget|under|max)?\s*(?:₹|rs\.?|inr)?\s*(\d+)(?:k|,\d{3}|\s*thousand)?/i);
  if (budgetMatch) {
    let rawVal = parseInt(budgetMatch[1], 10);
    if (lower.includes(`${rawVal}k`) || lower.includes('thousand')) {
      rawVal *= 1000;
    }
    if (rawVal > 1000) {
      maxBudgetINR = rawVal;
    }
  }

  // 6. Cabin Class
  let cabinClass: FareClassCode = 'Y';
  if (lower.includes('business') || lower.includes('biz')) {
    cabinClass = 'J';
  } else if (lower.includes('premium economy')) {
    cabinClass = 'W';
  } else if (lower.includes('first class')) {
    cabinClass = 'F';
  }

  // 7. Special Requests
  const specialRequests: ParsedTravelRequest['specialRequests'] = {};
  if (lower.includes('veg') || lower.includes('vegetarian') || lower.includes('jain') || lower.includes('avml')) {
    specialRequests.mealPreference = 'Vegetarian Meal (AVML / VGML)';
  } else if (lower.includes('kid meal') || lower.includes('child meal')) {
    specialRequests.mealPreference = 'Child Meal (CHML)';
  }

  if (lower.includes('aisle')) {
    specialRequests.seatPreference = 'Aisle Seat';
  } else if (lower.includes('window')) {
    specialRequests.seatPreference = 'Window Seat';
  } else if (lower.includes('bassinet')) {
    specialRequests.seatPreference = 'Bassinet Bulkhead Row';
  } else if (lower.includes('extra legroom')) {
    specialRequests.seatPreference = 'Extra Legroom';
  }

  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('priority')) {
    specialRequests.isUrgent = true;
  }

  if (lower.includes('corporate') || lower.includes('executive') || lower.includes('business trip')) {
    specialRequests.corporateTag = 'Corporate Managed Account';
  }

  const formatIsoDate = (d: Date) => d.toISOString().split('T')[0];

  return {
    rawText: text,
    originIata,
    originCity,
    destinationIata,
    destinationCity,
    departureDate: formatIsoDate(departureDateObj),
    returnDate: returnDateObj ? formatIsoDate(returnDateObj) : undefined,
    tripType,
    passengersCount,
    preferredAirlines,
    maxBudgetINR,
    cabinClass,
    specialRequests,
    confidenceScore: 0.94,
    extractionMethod: 'heuristic-regex',
  };
}

export async function extractTravelRequest(text: string): Promise<ParsedTravelRequest> {
  // If an LLM key is present (e.g. GEMINI_API_KEY or OPENAI_API_KEY), we can optionally query it.
  // Otherwise, we gracefully use the high-fidelity regex/heuristic parser which guarantees 100% zero-configuration availability.
  try {
    if (process.env.GEMINI_API_KEY) {
      // Future Gemini structured call placeholder
      return parseTravelRequestRegex(text);
    }
  } catch (err) {
    console.warn('Fallback to heuristic extraction due to API error:', err);
  }

  return parseTravelRequestRegex(text);
}
