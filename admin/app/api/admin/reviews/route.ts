import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Review from '@/lib/models/Review';
import Proposal from '@/lib/models/Proposal';
import Reviewer from '@/lib/models/Reviewer';

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';

    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const reviews = await Review.find(query).sort({ reviewedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: reviews });
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
    const body = await req.json();
    const { proposalId, reviewerId, score, comments, recommendation } = body;

    if (!proposalId || !reviewerId) {
      return NextResponse.json({ error: 'proposalId and reviewerId are required' }, { status: 400 });
    }

    // Fetch names for denormalisation
    const [proposal, reviewer] = await Promise.all([
      Proposal.findById(proposalId).lean(),
      Reviewer.findById(reviewerId).lean()
    ]);

    if (!proposal || !reviewer) {
      return NextResponse.json({ error: 'Proposal or Reviewer not found' }, { status: 404 });
    }

    const review = await Review.create({
      proposalId,
      proposalTitle: (proposal as any).title,
      reviewerId,
      reviewerName: (reviewer as any).name,
      score,
      comments,
      recommendation,
      status: 'submitted',
    });

    // Sync score, comments, reviewer info back to the proposal
    await Proposal.findByIdAndUpdate(proposalId, {
      assignedReviewerId: reviewerId,
      assignedReviewerName: (reviewer as any).name,
      score,
      comments,
      status: recommendation === 'approve' ? 'approved' : recommendation === 'reject' ? 'rejected' : 'under_review',
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
