export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Proposal from '@/lib/models/Proposal';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const proposal = await Proposal.findOne({ _id: params.id, submitterId: (session.user as any).id }).lean();
    if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: proposal });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const proposal = await Proposal.findOne({ _id: params.id, submitterId: (session.user as any).id });
    if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (proposal.status !== 'pending') {
      return NextResponse.json({ error: 'Can only delete pending proposals' }, { status: 400 });
    }
    
    // Attempt to delete file
    if (proposal.detailedProposalFile) {
      const filePath = path.join(process.cwd(), 'public', proposal.detailedProposalFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Proposal.deleteOne({ _id: params.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
