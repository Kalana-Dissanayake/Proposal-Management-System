export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Proposal from '@/lib/models/Proposal';

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status') || 'all';
    
    let query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [proposals, total] = await Promise.all([
      Proposal.find(query).sort({ submittedAt: -1 }).skip(skip).limit(limit).lean(),
      Proposal.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        proposals,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
