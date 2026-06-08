export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Researcher from '@/lib/models/Researcher';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const body = await req.json();
    const { name, email, phone, department, institution, researchAreas, bio, status } = body;

    const areasArray = typeof researchAreas === 'string'
      ? researchAreas.split(',').map((s: string) => s.trim()).filter(Boolean)
      : researchAreas || [];

    const updated = await Researcher.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name,
          email,
          phone,
          department,
          institution,
          researchAreas: areasArray,
          bio,
          status,
          updatedAt: new Date(),
        }
      },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Researcher not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
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
    const researcher = await Researcher.findByIdAndDelete(params.id);
    if (!researcher) {
      return NextResponse.json({ error: 'Researcher not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Researcher deleted successfully' });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
