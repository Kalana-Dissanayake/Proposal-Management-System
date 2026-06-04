import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { GET as authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Proposal from '@/lib/models/Proposal';
import fs from 'fs';
import path from 'path';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session || !(session as any).user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const budget = formData.get('budget') as string;
    const duration = formData.get('duration') as string;
    const researchArea = formData.get('researchArea') as string;
    const file = formData.get('detailedProposalFile') as File;

    if (!title || !budget || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and Word documents are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'proposals');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    fs.writeFileSync(filePath, buffer);

    await dbConnect();

    const proposal = await Proposal.create({
      title,
      submitterId: (session.user as any).id,
      researcherName: session.user.name,
      researcherEmail: session.user.email,
      budget: Number(budget),
      duration,
      researchArea,
      detailedProposalFile: `/uploads/proposals/${uniqueFilename}`,
      status: 'pending'
    });

    return NextResponse.json({ success: true, proposalId: proposal._id });
  } catch (error) {
    console.error('Proposal submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
