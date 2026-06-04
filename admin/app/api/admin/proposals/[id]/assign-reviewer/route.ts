import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Proposal from '@/lib/models/Proposal';
import Researcher from '@/lib/models/Researcher';
import Review from '@/lib/models/Review';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const { reviewerId } = await req.json();
    
    const reviewer = await Researcher.findById(reviewerId);
    if (!reviewer) {
      return NextResponse.json({ error: 'Reviewer not found' }, { status: 404 });
    }

    const proposal = await Proposal.findByIdAndUpdate(
      params.id,
      { 
        assignedReviewerId: reviewer._id, 
        assignedReviewerName: reviewer.name,
        status: 'under_review',
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });

    await Review.create({
      proposalId: proposal._id,
      proposalTitle: proposal.title,
      reviewerId: reviewer._id,
      reviewerName: reviewer.name,
      status: 'pending'
    });

    return NextResponse.json({ success: true, data: proposal });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
