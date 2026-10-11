import { FlightOffer, MarkupSettings, PriceBreakdown } from '@/types/travel';

export function calculateMarkup(baseNet: number, paxCount: number, markup: MarkupSettings): PriceBreakdown {
  const totalNet = baseNet * paxCount;
  let margin = 0;

  if (markup.mode === 'percentage') {
    margin = Math.round(totalNet * (markup.value / 100));
  } else {
    // Flat markup per passenger
    margin = Math.round(markup.value * paxCount);
  }

  return {
    netAirlineFare: totalNet,
    agencyMarkup: margin,
    grossClientFare: totalNet + margin,
    currency: 'INR',
  };
}

export function formatWhatsAppProposal(
  offer: FlightOffer,
  pnr: string,
  clientName: string,
  paxCount: number,
  price: PriceBreakdown,
  specialRequests?: string
): string {
  const segment = offer.outboundSegments[0];
  const airline = segment.airline.name;
  const flightNo = segment.flightNumber;
  const origin = `${segment.origin.city} (${segment.origin.iataCode})`;
  const dest = `${segment.destination.city} (${segment.destination.iataCode})`;
  const depTime = segment.departureTime.replace('T', ' ');
  const arrTime = segment.arrivalTime.replace('T', ' ');

  return `✈️ *FLIGHT QUOTATION — AIROPS TRAVEL COPILOT*
Reference PNR: *${pnr}*
Guest Name: *${clientName || 'Valued Client'}*
Travelers: *${paxCount} Passenger(s)*

🛫 *FLIGHT ITINERARY*
• *Airline:* ${airline} (${flightNo})
• *Sector:* ${origin} ➔ ${dest}
• *Departure:* ${depTime}
• *Arrival:* ${arrTime}
• *Cabin Class:* ${segment.cabinClassName} (${segment.cabinClass})
• *Baggage:* Check-in: ${segment.baggage.checkIn} | Cabin: ${segment.baggage.cabin}
• *Meal:* ${offer.mealIncluded ? 'Complimentary In-Flight Meal' : 'Buy Onboard'}
${specialRequests ? `• *Special Requests:* ${specialRequests}\n` : ''}
💰 *TOTAL ALL-INCLUSIVE PRICE*
*₹${price.grossClientFare.toLocaleString('en-IN')}* (Includes all taxes, fees & surcharges)

_Quote valid for 4 hours. Instant ticketing available upon confirmation._
Reply *CONFIRM* to issue e-tickets immediately.`;
}

export function formatGdsMonospace(offer: FlightOffer, pnr: string): string {
  const seg = offer.outboundSegments[0];
  const dateFormatted = new Date(seg.departureTime).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  }).toUpperCase().replace(' ', '');

  const depShort = seg.departureTime.split('T')[1].replace(':', '').slice(0, 4);
  const arrShort = seg.arrivalTime.split('T')[1].replace(':', '').slice(0, 4);

  return `RP/BOM1A0982/BOM1A0982            AA/SU   11OCT26/1430Z   ${pnr}
1.${seg.airline.code} ${seg.flightNumber.replace(/\s+/g, '')} ${seg.cabinClass} ${dateFormatted} ${seg.origin.iataCode}${seg.destination.iataCode} HK1  ${depShort} ${arrShort}  ${seg.aircraft?.slice(0, 4) || '77W'} E 0
SSR OTHS ${seg.airline.code} TICKETLESS REF NO ${pnr}
SSR VGML ${seg.airline.code} NN1 CONFIRMED MEAL
FA FP CASH/INR${offer.totalNetFare}/TX/TOTAL`;
}
