export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import ContactMessage from '@/lib/models/ContactMessage';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const msg = await ContactMessage.findByIdAndUpdate(params.id, { isRead: true }, { new: true }).lean();
    if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: msg });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
