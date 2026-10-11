# GSD Roadmap — AirOps Copilot

## Phase 1: Foundation & Types (Completed)
- [x] Configure GSD & CodeRabbit environment
- [x] Define comprehensive domain types (`src/types/travel.ts`)
- [x] Set up realistic GDS mock database (`src/lib/mockData.ts`)

## Phase 2: Core Engines & Resilient APIs (Completed)
- [x] Implement AI unstructured message extractor with regex/rule fallback (`src/lib/nlpExtractor.ts`)
- [x] Implement Amadeus GDS client with seamless mock fallback (`src/lib/amadeusClient.ts`)
- [x] Implement quotation formatting engine for WhatsApp & Email (`src/lib/quotationFormatter.ts`)
- [x] Build API endpoints: `/api/extract`, `/api/flights/search`, `/api/bookings`

## Phase 3: The Agent Copilot Workspace (`/workspace`) (Completed)
- [x] Navigation header with live Agent Wallet ($25,000 credit) & Engine Status indicator
- [x] Left Panel: Raw text input with 3 pre-configured sample request chips
- [x] Center Panel: Extracted parameter tag cloud & rich flight cards (airline badges, PNR class, duration, baggage)
- [x] Right Panel: Dynamic Markup Console (percentage & flat controls, Net vs Gross, live profit calculation)

## Phase 4: Quotation Modal & Ledger (`/bookings`) (Completed)
- [x] Branded Client Quotation Modal with 1-click WhatsApp/Email copy and ticket issue trigger
- [x] Activity & Booking Ledger table with PNR tracking, sector routes, gross fare, and status tags
- [x] End-to-end verification and clean Next.js production build (`next build`)
