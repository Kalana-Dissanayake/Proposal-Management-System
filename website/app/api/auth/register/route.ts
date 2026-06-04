import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Researcher from '@/lib/models/Researcher';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, institution } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await Researcher.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await Researcher.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      institution
    });

    return NextResponse.json({ success: true, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
