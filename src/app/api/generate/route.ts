import { NextRequest, NextResponse } from 'next/server';

// Placeholder — AI generation is handled client-side for MVP
export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'AI generation is handled client-side for MVP' }, { status: 501 });
}
