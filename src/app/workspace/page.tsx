'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Plane, 
  Calendar, 
  Users, 
  DollarSign, 
  Sliders, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  RefreshCw,
  Wallet,
  Building2,
  FileText
} from 'lucide-react';
import { 
  ParsedTravelRequest, 
  FlightOffer, 
  MarkupSettings, 
  PriceBreakdown,
  PNRRecord 
} from '@/types/travel';
import { SAMPLE_PROMPTS, generateMockFlights, INITIAL_AGENT_WALLET } from '@/lib/mockData';
import { calculateMarkup } from '@/lib/quotationFormatter';
import QuotationModal from '@/components/QuotationModal';

export default function WorkspacePage() {
  // Input & Extraction State
  const [inputText, setInputText] = useState(SAMPLE_PROMPTS[0].text);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ParsedTravelRequest | null>(null);

  // Flight Offers State
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [searchProvider, setSearchProvider] = useState<string>('Amadeus Mock Sandbox');

  // Markup & Pricing State
  const [markupMode, setMarkupMode] = useState<'percentage' | 'flat'>('percentage');
  const [markupValue, setMarkupValue] = useState<number>(8); // 8% or 1500 INR
  const [clientName, setClientName] = useState<string>('Rahul Sharma');
  const [pnrCode, setPnrCode] = useState<string>('6X9B2K');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initial load
  useEffect(() => {
    handleExtractAndSearch(SAMPLE_PROMPTS[0].text);
  }, []);

  // Generate 6-char PNR
  const generateNewPnr = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const handleExtractAndSearch = async (textToProcess: string) => {
    setIsExtracting(true);
    try {
      // 1. Extract unstructured parameters
      const extractRes = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProcess }),
      });
      const extractJson = await extractRes.json();
      const parsed: ParsedTravelRequest = extractJson.data;
      setExtractedData(parsed);

      // 2. Search flights
      const flightRes = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: parsed.originIata,
          destination: parsed.destinationIata,
          departureDate: parsed.departureDate,
          cabinClass: parsed.cabinClass,
        }),
      });
      const flightJson = await flightRes.json();

      if (flightJson.offers && flightJson.offers.length > 0) {
        setOffers(flightJson.offers);
        setSelectedOfferId(flightJson.offers[0].id);
        setSearchProvider(flightJson.provider || 'Amadeus Live/Mock GDS');
      }

      setPnrCode(generateNewPnr());
    } catch (err) {
      console.error('Error during extract and search:', err);
      // Fallback
      const fallbackOffers = generateMockFlights('BOM', 'DXB', '2026-10-18', 'Y');
      setOffers(fallbackOffers);
      setSelectedOfferId(fallbackOffers[0].id);
    } finally {
      setIsExtracting(false);
    }
  };

  const selectedOffer = offers.find((o) => o.id === selectedOfferId) || offers[0];

  const paxCount = extractedData?.passengersCount || 1;
  const markupSettings: MarkupSettings = {
    mode: markupMode,
    value: markupValue,
  };

  const priceBreakdown: PriceBreakdown = selectedOffer
    ? calculateMarkup(selectedOffer.totalNetFare, paxCount, markupSettings)
    : { netAirlineFare: 0, agencyMarkup: 0, grossClientFare: 0, currency: 'INR' };

  const handleSaveBooking = async (newRecord: PNRRecord) => {
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
    } catch (e) {
      console.error('Failed to save to ledger:', e);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 gds-grid-pattern">
      <div className="mx-auto max-w-7xl">
        
        {/* Workspace Title & Context Strip */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                The Agent Copilot Workspace
              </h1>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-xs text-sky-400">
                GDS Mode: Sabre / Amadeus NDC
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Convert raw customer WhatsApp or email inquiries into live GDS flight proposals in seconds.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-mono">Engine:</span>
            <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 font-mono text-emerald-400">
              {searchProvider}
            </span>
          </div>
        </div>

        {/* 3-Column Split View Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: Inbound Request Ingestion Box (Cols 4/12)     */}
          {/* ========================================================= */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse"></div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Inbound Customer Request
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Natural Language</span>
              </div>

              {/* Sample Email/WhatsApp Quick Chips */}
              <div className="mb-3">
                <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                  Pre-configured Quick Test Scenarios:
                </span>
                <div className="flex flex-col gap-1.5">
                  {SAMPLE_PROMPTS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        setInputText(sample.text);
                        handleExtractAndSearch(sample.text);
                      }}
                      className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-xs text-slate-300 hover:border-sky-500/50 hover:bg-slate-800/80 hover:text-white transition-all"
                    >
                      <span className="font-medium truncate">{sample.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Raw Message Textarea */}
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={5}
                  placeholder="Paste raw customer WhatsApp or email message here..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleExtractAndSearch(inputText)}
                disabled={isExtracting}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 transition-all disabled:opacity-50"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Extracting & Querying GDS...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Extract & Search Flights
                  </>
                )}
              </button>
            </div>

            {/* Travel Agent Tips Card */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1">
                <ShieldCheck className="h-4 w-4 text-sky-400" />
                GDS & NDC Certified Flow
              </div>
              <p className="text-[11px] leading-relaxed">
                Automatically maps city names to official IATA airport codes, parses relative travel dates, and fetches wholesale net fares for instant agency markups.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CENTER PANEL: Extracted Tags & Live Flights (Cols 5/12)   */}
          {/* ========================================================= */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            
            {/* Extracted Parameters Tag Cloud */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  AI Extracted Parameters
                </h3>
                <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                  Confidence: 94%
                </span>
              </div>

              {extractedData ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {/* Route Pill */}
                  <div className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-2.5 py-1 text-xs font-mono font-bold text-sky-300">
                    <span>{extractedData.originIata}</span>
                    <Plane className="h-3 w-3 text-sky-400 transform -rotate-45" />
                    <span>{extractedData.destinationIata}</span>
                  </div>

                  {/* Dates Pill */}
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{extractedData.departureDate}</span>
                    {extractedData.returnDate && <span>➔ {extractedData.returnDate}</span>}
                  </div>

                  {/* Pax Pill */}
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-200">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{extractedData.passengersCount} Pax</span>
                  </div>

                  {/* Cabin Class */}
                  <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300">
                    <span>Class {extractedData.cabinClass}</span>
                  </div>

                  {/* Special Requests */}
                  {extractedData.specialRequests.mealPreference && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                      <span>{extractedData.specialRequests.mealPreference}</span>
                    </div>
                  )}

                  {extractedData.specialRequests.seatPreference && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
                      <span>{extractedData.specialRequests.seatPreference}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-2 text-xs text-slate-500">No parameters extracted yet.</div>
              )}
            </div>

            {/* Flight Results Header */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Available GDS Flight Offers ({offers.length})
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Wholesale Net Rates
              </span>
            </div>

            {/* Flight Offers Cards List */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {offers.map((offer) => {
                const seg = offer.outboundSegments[0];
                const isSelected = offer.id === selectedOfferId;
                const depTime = seg.departureTime.split('T')[1].slice(0, 5);
                const arrTime = seg.arrivalTime.split('T')[1].slice(0, 5);
                const durationHrs = Math.floor(offer.totalDurationMinutes / 60);
                const durationMins = offer.totalDurationMinutes % 60;

                return (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedOfferId(offer.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-slate-900/90 shadow-lg shadow-sky-950/40 ring-1 ring-sky-500'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
                    }`}
                  >
                    {/* Airline & Tag Strip */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/20 text-xs font-bold text-sky-400 font-mono">
                          {seg.airline.code}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {seg.airline.name} • <span className="font-mono text-sky-400">{seg.flightNumber}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {seg.aircraft || 'Commercial Jet'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-white block">
                          ₹{offer.totalNetFare.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Net Fare / seat</span>
                      </div>
                    </div>

                    {/* Flight Times & Routing Visual */}
                    <div className="grid grid-cols-3 items-center py-3 text-center">
                      <div className="text-left">
                        <span className="font-mono text-base font-bold text-white">
                          {depTime}
                        </span>
                        <p className="text-[11px] font-mono text-slate-400">{seg.origin.iataCode}</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-mono text-slate-400">
                          {durationHrs}h {durationMins}m
                        </span>
                        <div className="relative w-full flex items-center my-1">
                          <div className="h-0.5 w-full bg-slate-700"></div>
                          <Plane className="absolute left-1/2 -translate-x-1/2 h-3 w-3 text-sky-400" />
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-400 uppercase">
                          {offer.stopsCount === 0 ? 'Non-Stop' : `${offer.stopsCount} Stop`}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-white">
                          {arrTime}
                        </span>
                        <p className="text-[11px] font-mono text-slate-400">{seg.destination.iataCode}</p>
                      </div>
                    </div>

                    {/* Inclusions Strip */}
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-slate-500" />
                        {seg.baggage.checkIn}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">
                          Basis: {offer.fareBasisCode}
                        </span>
                        <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-sky-400' : 'bg-slate-700'}`}></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL: Quotation & Markup Console (Cols 3/12)       */}
          {/* ========================================================= */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Markup & Margin Engine
                </h3>
                <span className="font-mono text-[10px] text-sky-400 bg-sky-950 border border-sky-800 px-2 py-0.5 rounded-md">
                  PNR: {pnrCode}
                </span>
              </div>

              {/* Passenger Name & Contact */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Client / Corporate Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Guest Name (e.g. Rahul Sharma)"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Markup Mode Switcher */}
              <div className="mb-4">
                <label className="text-[11px] font-medium text-slate-400 block mb-1.5">
                  Agency Commission Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMarkupMode('percentage');
                      setMarkupValue(8);
                    }}
                    className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                      markupMode === 'percentage'
                        ? 'border border-sky-500 bg-sky-500/10 text-sky-400'
                        : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Percentage (%)
                  </button>

                  <button
                    onClick={() => {
                      setMarkupMode('flat');
                      setMarkupValue(1500);
                    }}
                    className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                      markupMode === 'flat'
                        ? 'border border-sky-500 bg-sky-500/10 text-sky-400'
                        : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Flat (₹ / Pax)
                  </button>
                </div>
              </div>

              {/* Markup Slider / Input */}
              <div className="mb-5 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Configured Margin:</span>
                  <span className="font-mono font-bold text-sky-400">
                    {markupMode === 'percentage' ? `+${markupValue}%` : `+₹${markupValue.toLocaleString('en-IN')}`}
                  </span>
                </div>

                {markupMode === 'percentage' ? (
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={markupValue}
                    onChange={(e) => setMarkupValue(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                ) : (
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={markupValue}
                    onChange={(e) => setMarkupValue(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Dynamic Price Breakdown Box */}
              <div className="space-y-2.5 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Airline Base (Net):</span>
                  <span>₹{priceBreakdown.netAirlineFare.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-semibold border-b border-slate-800 pb-2">
                  <span>Agency Profit (+):</span>
                  <span>+₹{priceBreakdown.agencyMarkup.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-sans font-bold text-slate-200">Final Client Fare:</span>
                  <span className="text-lg font-black text-sky-400 font-mono">
                    ₹{priceBreakdown.grossClientFare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-xs font-bold text-slate-950 hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
              >
                <FileText className="h-4 w-4" />
                Generate Client Quotation
              </button>

            </div>
          </div>

        </div>

      </div>

      {/* Quotation Preview Modal */}
      {selectedOffer && (
        <QuotationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          offer={selectedOffer}
          pnr={pnrCode}
          clientName={clientName}
          paxCount={paxCount}
          price={priceBreakdown}
          specialRequests={extractedData?.specialRequests.mealPreference}
          rawRequestText={inputText}
          onSaveBooking={handleSaveBooking}
        />
      )}
    </div>
  );
}
