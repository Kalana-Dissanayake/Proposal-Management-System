export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

const GrantSchema = new mongoose.Schema({
  title: String,
  description: String,
  fundingAmount: Number,
  fundingBody: String,
  researchArea: String,
  eligibility: String,
  deadline: Date,
  status: { type: String, default: 'open' },
  createdAt: { type: Date, default: Date.now },
});
const Grant = mongoose.models.Grant || mongoose.model('Grant', GrantSchema);

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'open';
    const limit = searchParams.get('limit');

    let query: Record<string, string> = {};
    if (status !== 'all') {
      query.status = status;
    }

    let mQuery = Grant.find(query).sort({ deadline: 1 });
    if (limit) {
      mQuery = mQuery.limit(parseInt(limit));
    }

    const data = await mQuery.lean();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[Grants API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
