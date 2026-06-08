export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AdminUser from '@/lib/models/AdminUser';
import bcrypt from 'bcryptjs';
import { signAdminToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    const admin = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signAdminToken({ id: admin._id.toString(), email: admin.email });

    const response = NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name } });
    
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
