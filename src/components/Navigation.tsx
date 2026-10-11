'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plane, 
  Layers, 
  Wallet, 
  CheckCircle2, 
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';
import { INITIAL_AGENT_WALLET } from '@/lib/mockData';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Edition */}
        <div className="flex items-center gap-6">
          <Link href="/workspace" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/40 transition-all">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Plane className="h-5 w-5 text-sky-400 transform -rotate-45 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-lg">
                  AirOps <span className="text-sky-400 font-extrabold">Copilot</span>
                </span>
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                  OptimusX
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider">
                TMC OPERATING SYSTEM • GDS/NDC
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 ml-4">
            <Link
              href="/workspace"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === '/workspace' || pathname === '/'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Copilot Workspace
            </Link>

            <Link
              href="/bookings"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === '/bookings'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Bookings & PNR Ledger
            </Link>
          </nav>
        </div>

        {/* Right side widgets: Status & Agent Wallet */}
        <div className="flex items-center gap-3">
          
          {/* Zero-Config Engine Health Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-semibold">GDS Live & Mock Ready</span>
          </div>

          {/* Agent Wallet Balance Widget */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 shadow-inner">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <Wallet className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Agent Credit Limit
              </span>
              <span className="font-mono text-xs font-bold text-slate-100">
                ${INITIAL_AGENT_WALLET.availableCredit.toLocaleString('en-US')}
                <span className="text-[10px] text-emerald-400 font-normal ml-1">Avail</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
