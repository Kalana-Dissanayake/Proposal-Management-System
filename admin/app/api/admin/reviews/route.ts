import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Review from '@/lib/models/Review';
import Proposal from '@/lib/models/Proposal';
import Researcher from '@/lib/models/Researcher';

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const data = await Review.find().populate('proposalId', 'title').populate('reviewerId', 'name email').sort({ reviewedAt: -1 }).lean();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const { proposalId, reviewerId } = await req.json();

    const proposal = await Proposal.findById(proposalId);
    const reviewer = await Researcher.findById(reviewerId);

    if (!proposal || !reviewer) {
      return NextResponse.json({ error: 'Proposal or Reviewer not found' }, { status: 404 });
    }

    const review = await Review.create({
      proposalId,
      proposalTitle: proposal.title,
      reviewerId,
      reviewerName: reviewer.name,
      status: 'pending'
    });

    await Proposal.findByIdAndUpdate(proposalId, {
      status: 'under_review',
      assignedReviewerId: reviewerId,
      assignedReviewerName: reviewer.name,
      updatedAt: new Date()
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
