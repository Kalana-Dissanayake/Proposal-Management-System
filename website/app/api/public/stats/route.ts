export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Proposal from '@/lib/models/Proposal';
import Researcher from '@/lib/models/Researcher';

// We need the Grant model — define it inline since it lives in admin
import mongoose from 'mongoose';

const GrantSchema = new mongoose.Schema({
  title: String,
  status: String,
});
const Grant = mongoose.models.Grant || mongoose.model('Grant', GrantSchema);

export async function GET() {
  await dbConnect();
  try {
    const [totalProposals, totalResearchers, totalGrants] = await Promise.all([
      Proposal.countDocuments(),
      Researcher.countDocuments(),
      Grant.countDocuments({ status: 'open' }),
    ]);

    return NextResponse.json({
      success: true,
      totalProposals,
      totalResearchers,
      totalGrants,
    });
  } catch (error) {
    console.error('[Stats API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
