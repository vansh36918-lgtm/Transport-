import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PNR_LEDGER } from '@/lib/mockData';
import { PNRRecord } from '@/types/travel';

// Server-side in-memory ledger that persists during the server runtime
let ledgerState: PNRRecord[] = [...INITIAL_PNR_LEDGER];

export async function GET() {
  return NextResponse.json({
    success: true,
    bookings: ledgerState,
    totalCount: ledgerState.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: PNRRecord = await req.json();

    if (!body.pnr || !body.selectedOffer) {
      return NextResponse.json(
        { error: 'Invalid PNR record payload' },
        { status: 400 }
      );
    }

    // Prepend new booking to top of ledger
    ledgerState = [body, ...ledgerState];

    return NextResponse.json({
      success: true,
      message: 'Booking saved to ledger',
      booking: body,
      totalCount: ledgerState.length,
    });
  } catch (error: any) {
    console.error('API /api/bookings POST error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save booking' },
      { status: 500 }
    );
  }
}
