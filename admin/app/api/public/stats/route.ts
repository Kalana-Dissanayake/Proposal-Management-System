export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Proposal from '@/lib/models/Proposal';
import Grant from '@/lib/models/Grant';
import Reviewer from '@/lib/models/Reviewer';
import Researcher from '@/lib/models/Researcher';

export async function GET() {
  await dbConnect();
  try {
    const [totalProposals, totalGrants, totalReviewers] = await Promise.all([
      Proposal.countDocuments(),
      Grant.countDocuments({ status: 'open' }),
      Reviewer.countDocuments()
    ]);

    return NextResponse.json({
      success: true,
      totalProposals,
      totalGrants,
      totalReviewers
    });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
