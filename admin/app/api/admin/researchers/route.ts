import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';
import Researcher from '@/lib/models/Researcher';

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    let query: any = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const data = await Researcher.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const body = await req.json();
    const { name, email, phone, department, institution, researchAreas, bio, status } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const existing = await Researcher.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'A researcher with this email already exists' }, { status: 409 });
    }

    const areasArray = typeof researchAreas === 'string'
      ? researchAreas.split(',').map((s: string) => s.trim()).filter(Boolean)
      : researchAreas || [];

    const researcher = await Researcher.create({
      name,
      email,
      phone,
      department,
      institution,
      researchAreas: areasArray,
      bio,
      status: status || 'active',
    });

    return NextResponse.json({ success: true, data: researcher });
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
