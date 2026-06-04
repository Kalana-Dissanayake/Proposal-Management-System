import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Grant from '@/lib/models/Grant';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'open';
    const limit = searchParams.get('limit');
    
    let query: any = {};
    if (status !== 'all') {
      query.status = status;
    }

    let mQuery = Grant.find(query).sort({ deadline: 1 });
    if (limit) {
      mQuery = mQuery.limit(parseInt(limit));
    }

    const data = await mQuery.lean();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
