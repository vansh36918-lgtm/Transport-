import { NextRequest, NextResponse } from 'next/server';
import { extractTravelRequest } from '@/lib/nlpExtractor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text || '';

    if (!text.trim()) {
      return NextResponse.json(
        { error: 'Prompt text is required' },
        { status: 400 }
      );
    }

    const parsed = await extractTravelRequest(text);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('API /api/extract error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to extract travel request' },
      { status: 500 }
    );
  }
}
