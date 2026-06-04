import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ContactMessage from '@/lib/models/ContactMessage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    await dbConnect();

    await ContactMessage.create({ name, email, subject, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
