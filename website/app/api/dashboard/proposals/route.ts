import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Proposal from '@/lib/models/Proposal';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session || !(session as any).user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  try {
    const proposals = await Proposal.find({ submitterId: (session.user as any).id }).sort({ submittedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: proposals });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
