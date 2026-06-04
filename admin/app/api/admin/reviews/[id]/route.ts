import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Review from '@/lib/models/Review';
import Proposal from '@/lib/models/Proposal';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const { score, comments, recommendation } = await req.json();

    const review = await Review.findByIdAndUpdate(
      params.id,
      { score, comments, recommendation, status: 'submitted', reviewedAt: new Date() },
      { new: true }
    );

    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (recommendation === 'approve' || recommendation === 'reject') {
      const statusMap: any = { approve: 'approved', reject: 'rejected' };
      await Proposal.findByIdAndUpdate(review.proposalId, {
        status: statusMap[recommendation],
        updatedAt: new Date()
      });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const review = await Review.findByIdAndDelete(params.id);
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
