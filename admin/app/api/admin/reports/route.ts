export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Proposal from '@/lib/models/Proposal';
import Grant from '@/lib/models/Grant';

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();

  try {
    const [
      proposalsByStatus,
      grantsByStatus,
      budgetByArea,
      proposalsPerMonth,
      topResearchers
    ] = await Promise.all([
      Proposal.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Grant.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Proposal.aggregate([
        { $group: { _id: '$researchArea', totalBudget: { $sum: '$budget' } } },
        { $sort: { totalBudget: -1 } }
      ]),
      Proposal.aggregate([
        { $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$submittedAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),
      Proposal.aggregate([
        { $group: { _id: '$researcherName', proposalCount: { $sum: 1 } } },
        { $sort: { proposalCount: -1 } },
        { $limit: 5 }
      ])
    ]);

    return NextResponse.json({
      success: true,
      data: {
        proposalsByStatus,
        grantsByStatus,
        budgetByArea,
        proposalsPerMonth,
        topResearchers
      }
    });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
