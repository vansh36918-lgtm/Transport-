import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/amadeusClient';
import { FareClassCode } from '@/types/travel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination, departureDate, cabinClass } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and Destination IATA codes are required' },
        { status: 400 }
      );
    }

    const safeDepDate = departureDate || new Date().toISOString().split('T')[0];
    const safeCabin: FareClassCode = cabinClass || 'Y';

    const result = await searchFlights(origin, destination, safeDepDate, safeCabin);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('API /api/flights/search error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to search flights' },
      { status: 500 }
    );
  }
}
