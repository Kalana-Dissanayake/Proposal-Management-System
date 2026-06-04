import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Proposal from '@/lib/models/Proposal';
import Grant from '@/lib/models/Grant';

export async function GET() {
  await dbConnect();
  try {
    const proposalAreas = await Proposal.distinct('researchArea');
    const grantAreas = await Grant.distinct('researchArea');
    
    const allAreas = [...proposalAreas, ...grantAreas];
    const uniqueAreas = Array.from(new Set(allAreas))
      .filter((area) => typeof area === 'string' && area.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ success: true, areas: uniqueAreas });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
