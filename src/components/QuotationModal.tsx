'use client';

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Mail, 
  MessageSquare, 
  Plane, 
  Calendar, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  Terminal,
  Download
} from 'lucide-react';
import { FlightOffer, PriceBreakdown, PNRRecord } from '@/types/travel';
import { formatWhatsAppProposal, formatGdsMonospace } from '@/lib/quotationFormatter';

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: FlightOffer;
  pnr: string;
  clientName: string;
  paxCount: number;
  price: PriceBreakdown;
  specialRequests?: string;
  rawRequestText?: string;
  onSaveBooking: (booking: PNRRecord) => void;
}

export default function QuotationModal({
  isOpen,
  onClose,
  offer,
  pnr,
  clientName,
  paxCount,
  price,
  specialRequests,
  rawRequestText,
  onSaveBooking,
}: QuotationModalProps) {
  const [copiedType, setCopiedType] = useState<'whatsapp' | 'email' | 'gds' | null>(null);
  const [activeTab, setActiveTab] = useState<'client-card' | 'gds-cryptic'>('client-card');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const segment = offer.outboundSegments[0];
  const origin = segment.origin;
  const dest = segment.destination;
  const depDateFormatted = new Date(segment.departureTime).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const depTimeFormatted = segment.departureTime.split('T')[1].slice(0, 5);
  const arrTimeFormatted = segment.arrivalTime.split('T')[1].slice(0, 5);

  const whatsAppText = formatWhatsAppProposal(
    offer,
    pnr,
    clientName,
    paxCount,
    price,
    specialRequests
  );

  const gdsText = formatGdsMonospace(offer, pnr);

  const handleCopy = (text: string, type: 'whatsapp' | 'email' | 'gds') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSaveToLedger = () => {
    const newRecord: PNRRecord = {
      pnr,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      clientName: clientName || 'Corporate Client',
      clientEmail: 'corporate.desk@client.com',
      companyName: 'AirOps Priority Corp',
      originIata: origin.iataCode,
      destinationIata: dest.iataCode,
      departureDate: segment.departureTime.split('T')[0],
      passengerCount: paxCount,
      selectedOffer: offer,
      markup: { mode: 'percentage', value: 8 },
      priceBreakdown: price,
      specialRequests: specialRequests || 'None',
      rawRequestText,
    };

    onSaveBooking(newRecord);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-sky-950/40">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">Client Itinerary Quotation</h3>
                <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded-md">
                  PNR: {pnr}
                </span>
              </div>
              <p className="text-xs text-slate-400">Ready to dispatch via WhatsApp, Email, or Sabre GDS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Switcher: Client Card vs GDS Cryptic */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('client-card')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium transition-all ${
              activeTab === 'client-card'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plane className="h-3.5 w-3.5" />
            Client Visual Proposal
          </button>

          <button
            onClick={() => setActiveTab('gds-cryptic')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-mono transition-all ${
              activeTab === 'gds-cryptic'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Sabre / Amadeus Monospace PNR
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'client-card' ? (
            <div className="space-y-4">
              
              {/* Branded Itinerary Card */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-5 shadow-inner">
                
                {/* Header sector & airline */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-xs">
                      {segment.airline.code}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        {segment.airline.name} • {segment.flightNumber}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Aircraft: {segment.aircraft} • Class {segment.cabinClass} ({segment.cabinClassName})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                      Confirmed Sector
                    </span>
                    <span className="font-mono text-sm font-bold text-sky-400">
                      {origin.iataCode} ➔ {dest.iataCode}
                    </span>
                  </div>
                </div>

                {/* Times & Route Visual */}
                <div className="grid grid-cols-3 items-center py-4 text-center">
                  <div className="text-left">
                    <span className="font-mono text-2xl font-bold text-white tracking-tight">
                      {depTimeFormatted}
                    </span>
                    <p className="text-xs font-medium text-slate-300">{origin.city} ({origin.iataCode})</p>
                    <p className="text-[11px] text-slate-400">{depDateFormatted}</p>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      {Math.floor(offer.totalDurationMinutes / 60)}h {offer.totalDurationMinutes % 60}m
                    </span>
                    <div className="relative w-full flex items-center my-1.5">
                      <div className="h-0.5 w-full bg-slate-700"></div>
                      <Plane className="absolute left-1/2 -translate-x-1/2 h-3.5 w-3.5 text-sky-400" />
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {offer.stopsCount === 0 ? 'Non-Stop Direct' : `${offer.stopsCount} Stop Layover`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-2xl font-bold text-white tracking-tight">
                      {arrTimeFormatted}
                    </span>
                    <p className="text-xs font-medium text-slate-300">{dest.city} ({dest.iataCode})</p>
                    <p className="text-[11px] text-slate-400">{depDateFormatted}</p>
                  </div>
                </div>

                {/* Baggage & Meal Inclusions */}
                <div className="grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span>Check-in: <strong className="text-slate-100">{segment.baggage.checkIn}</strong> | Cabin: <strong className="text-slate-100">{segment.baggage.cabin}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>{offer.mealIncluded ? 'Complimentary Meal Included' : 'Buy Onboard Meals'}</span>
                  </div>
                </div>

                {specialRequests && (
                  <div className="mt-3 rounded-lg bg-sky-950/40 border border-sky-800/40 p-2.5 text-xs text-sky-200">
                    <strong className="text-sky-300">Special Handling: </strong> {specialRequests}
                  </div>
                )}
              </div>

              {/* Price Breakdown Banner */}
              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-900/50 p-4">
                <div>
                  <span className="text-xs font-medium text-slate-300 block">Total Client Quotation ({paxCount} Passenger{paxCount > 1 ? 's' : ''})</span>
                  <span className="text-[11px] text-slate-400">All inclusive of airline fare, airport taxes & agency fee</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-sky-400">
                    ₹{price.grossClientFare.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-400 block font-mono">
                    Net: ₹{price.netAirlineFare.toLocaleString('en-IN')} | Profit: ₹{price.agencyMarkup.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            /* Monospace GDS View */
            <div className="rounded-xl border border-slate-800 bg-black p-4 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto shadow-inner">
              <pre>{gdsText}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-2">
            
            {/* Copy for WhatsApp */}
            <button
              onClick={() => handleCopy(whatsAppText, 'whatsapp')}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-600/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/20 transition-all"
            >
              {copiedType === 'whatsapp' ? <Check className="h-4 w-4 text-emerald-400" /> : <MessageSquare className="h-4 w-4" />}
              {copiedType === 'whatsapp' ? 'Copied WhatsApp!' : 'Copy for WhatsApp'}
            </button>

            {/* Copy for Email */}
            <button
              onClick={() => handleCopy(whatsAppText, 'email')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-all"
            >
              {copiedType === 'email' ? <Check className="h-4 w-4 text-sky-400" /> : <Mail className="h-4 w-4" />}
              {copiedType === 'email' ? 'Copied Email!' : 'Copy for Email'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToLedger}
              disabled={isSaved}
              className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4 text-slate-950" />
                  Ticketed & Saved!
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-slate-950" />
                  Issue Ticket & Save to Ledger
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
