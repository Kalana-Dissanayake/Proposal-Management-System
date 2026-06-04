import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Proposal from '@/lib/models/Proposal';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const area = searchParams.get('area');
    
    let query: any = { status: 'approved' };
    if (area && area !== 'all') {
      query.researchArea = area;
    }

    const data = await Proposal.find(query).sort({ submittedAt: -1 }).lean();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { title, researcherName, researcherEmail, abstract, budget } = body;

    if (!title || !researcherName || !researcherEmail || !abstract || !budget) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (typeof budget !== 'number' || budget <= 0) {
      return NextResponse.json({ error: 'Budget must be a positive number' }, { status: 400 });
    }

    if (!/^\S+@\S+\.\S+$/.test(researcherEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const proposal = await Proposal.create({
      ...body,
      status: 'pending'
    });

    return NextResponse.json({ success: true, proposalId: proposal._id });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
