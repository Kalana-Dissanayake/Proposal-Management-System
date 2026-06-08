export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Grant from '@/lib/models/Grant';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const data = await Grant.findById(params.id).lean();
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
