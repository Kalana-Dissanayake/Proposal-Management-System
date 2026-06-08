export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Proposal from '@/lib/models/Proposal';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const area = searchParams.get('area') || 'all';

    const query: Record<string, unknown> = { status: 'approved' };
    if (area && area !== 'all') {
      query.researchArea = area;
    }

    const proposals = await Proposal.find(query)
      .sort({ submittedAt: -1 })
      .select('title researcherName researchArea budget duration status submittedAt')
      .lean();

    return NextResponse.json({ success: true, data: proposals });
  } catch (error) {
    console.error('[Public Proposals API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
