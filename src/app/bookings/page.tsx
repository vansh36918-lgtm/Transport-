'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Plane, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  DollarSign, 
  Wallet,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { PNRRecord, PNRStatus } from '@/types/travel';
import { INITIAL_PNR_LEDGER, INITIAL_AGENT_WALLET } from '@/lib/mockData';
import QuotationModal from '@/components/QuotationModal';

export default function BookingsLedgerPage() {
  const [bookings, setBookings] = useState<PNRRecord[]>(INITIAL_PNR_LEDGER);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Selected booking for modal preview
  const [selectedBooking, setSelectedBooking] = useState<PNRRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error('Failed to load bookings from API:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'ALL' || b.status.toUpperCase() === filterStatus;
    const matchesSearch =
      b.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.originIata.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destinationIata.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalTurnover = bookings.reduce((acc, curr) => acc + curr.priceBreakdown.grossClientFare, 0);
  const totalMarkupEarned = bookings.reduce((acc, curr) => acc + curr.priceBreakdown.agencyMarkup, 0);
  const ticketedCount = bookings.filter((b) => b.status === 'Ticketed' || b.status === 'Confirmed').length;

  const getStatusBadge = (status: PNRStatus) => {
    switch (status) {
      case 'Ticketed':
        return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
      case 'Confirmed':
        return 'border-sky-500/40 bg-sky-500/10 text-sky-400';
      case 'Quoted':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-400';
      case 'Draft':
      default:
        return 'border-slate-700 bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 gds-grid-pattern">
      <div className="mx-auto max-w-7xl">
        
        {/* Page Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Bookings & Activity Ledger
              </h1>
              <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-xs text-sky-400">
                GDS Audit Log
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Complete TMC passenger name records (PNRs), wholesale margins, and corporate billing tracking.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-850 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Ledger
          </button>
        </div>

        {/* Top KPI Cards Strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total PNRs Issued</span>
              <Layers className="h-4 w-4 text-sky-400" />
            </div>
            <span className="font-mono text-2xl font-bold text-white">
              {bookings.length}
            </span>
            <span className="text-[11px] text-emerald-400 block mt-1 font-mono">
              {ticketedCount} Active / Confirmed
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Gross Client Turnover</span>
              <DollarSign className="h-4 w-4 text-sky-400" />
            </div>
            <span className="font-mono text-2xl font-bold text-white">
              ₹{totalTurnover.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              All client invoices
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Agency Margin Profit</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-mono text-2xl font-bold text-emerald-400">
              ₹{totalMarkupEarned.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-500/80 block mt-1 font-mono">
              Net Agency Commission
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Agent Credit Balance</span>
              <Wallet className="h-4 w-4 text-purple-400" />
            </div>
            <span className="font-mono text-2xl font-bold text-white">
              ${INITIAL_AGENT_WALLET.availableCredit.toLocaleString('en-US')}
            </span>
            <span className="text-[11px] text-purple-300 block mt-1">
              Wholesale GDS Line of Credit
            </span>
          </div>

        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3.5">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PNR, passenger name, or IATA sector..."
              className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'TICKETED', 'CONFIRMED', 'QUOTED', 'DRAFT'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  filterStatus === status
                    ? 'border border-sky-500 bg-sky-500/10 text-sky-400'
                    : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

        </div>

        {/* Ledger Data Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                <tr>
                  <th className="px-5 py-3.5">PNR Reference</th>
                  <th className="px-5 py-3.5">Passenger / Account</th>
                  <th className="px-5 py-3.5">Sector & Airline</th>
                  <th className="px-5 py-3.5">Travel Date</th>
                  <th className="px-5 py-3.5 text-right">Net Wholesale</th>
                  <th className="px-5 py-3.5 text-right">Margin Earned</th>
                  <th className="px-5 py-3.5 text-right">Gross Quoted</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b.pnr} className="hover:bg-slate-800/40 transition-colors">
                      {/* PNR Code */}
                      <td className="px-5 py-4 font-mono font-bold text-sky-400">
                        {b.pnr}
                      </td>

                      {/* Client */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-white block">{b.clientName}</span>
                        <span className="text-[11px] text-slate-400">{b.companyName || 'Retail Customer'}</span>
                      </td>

                      {/* Route */}
                      <td className="px-5 py-4 font-mono">
                        <div className="flex items-center gap-1.5 font-bold text-slate-200">
                          <span>{b.originIata}</span>
                          <Plane className="h-3 w-3 text-sky-400 transform -rotate-45" />
                          <span>{b.destinationIata}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {b.selectedOffer.outboundSegments[0].airline.name} ({b.passengerCount} Pax)
                        </span>
                      </td>

                      {/* Travel Date */}
                      <td className="px-5 py-4 font-mono text-slate-300">
                        {b.departureDate}
                      </td>

                      {/* Net */}
                      <td className="px-5 py-4 text-right font-mono text-slate-400">
                        ₹{b.priceBreakdown.netAirlineFare.toLocaleString('en-IN')}
                      </td>

                      {/* Profit */}
                      <td className="px-5 py-4 text-right font-mono font-semibold text-emerald-400">
                        +₹{b.priceBreakdown.agencyMarkup.toLocaleString('en-IN')}
                      </td>

                      {/* Gross */}
                      <td className="px-5 py-4 text-right font-mono font-bold text-white">
                        ₹{b.priceBreakdown.grossClientFare.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono ${getStatusBadge(b.status)}`}>
                          {b.status}
                        </span>
                      </td>

                      {/* View Action */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setIsModalOpen(true);
                          }}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:border-sky-500 hover:text-sky-400 transition-all"
                        >
                          View Quote
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500 text-xs">
                      No matching PNR bookings found in ledger.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Booking View Modal */}
      {selectedBooking && (
        <QuotationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          offer={selectedBooking.selectedOffer}
          pnr={selectedBooking.pnr}
          clientName={selectedBooking.clientName}
          paxCount={selectedBooking.passengerCount}
          price={selectedBooking.priceBreakdown}
          specialRequests={selectedBooking.specialRequests}
          rawRequestText={selectedBooking.rawRequestText}
          onSaveBooking={() => {}}
        />
      )}
    </div>
  );
}
