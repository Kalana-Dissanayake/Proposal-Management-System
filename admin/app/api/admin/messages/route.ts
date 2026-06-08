export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import ContactMessage from '@/lib/models/ContactMessage';

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const data = await ContactMessage.find().sort({ submittedAt: -1 }).lean();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
