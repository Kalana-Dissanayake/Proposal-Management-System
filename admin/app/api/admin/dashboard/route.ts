import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Reviewer from '@/lib/models/Reviewer';
import Researcher from '@/lib/models/Researcher';
import Proposal from '@/lib/models/Proposal';
import Grant from '@/lib/models/Grant';
import Review from '@/lib/models/Review';
import ContactMessage from '@/lib/models/ContactMessage';

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();

  try {
    const [
      totalResearchers, totalReviewers, totalProposals, pendingProposals,
      approvedProposals, rejectedProposals, underReviewProposals,
      totalGrants, openGrants, totalReviews, unreadMessages,
      recentProposals, recentMessages
    ] = await Promise.all([
      Researcher.countDocuments(),
      Reviewer.countDocuments(),
      Proposal.countDocuments(),
      Proposal.countDocuments({ status: 'pending' }),
      Proposal.countDocuments({ status: 'approved' }),
      Proposal.countDocuments({ status: 'rejected' }),
      Proposal.countDocuments({ status: 'under_review' }),
      Grant.countDocuments(),
      Grant.countDocuments({ status: 'open' }),
      Review.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      Proposal.find().sort({ submittedAt: -1 }).limit(5).lean(),
      ContactMessage.find().sort({ submittedAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalResearchers, totalReviewers, totalProposals, pendingProposals,
        approvedProposals, rejectedProposals, underReviewProposals,
        totalGrants, openGrants, totalReviews, unreadMessages,
        recentProposals, recentMessages
      }
    });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
