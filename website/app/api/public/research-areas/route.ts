export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Proposal from '@/lib/models/Proposal';
import mongoose from 'mongoose';

const GrantSchema = new mongoose.Schema({ researchArea: String });
const Grant = mongoose.models.Grant || mongoose.model('Grant', GrantSchema);

const STATIC_AREAS = [
  'Artificial Intelligence',
  'Biomedical Science',
  'Renewable Energy',
  'Climate Change',
  'Quantum Computing',
  'Data Science',
  'Nanotechnology',
  'Space Exploration',
  'Environmental Science',
  'Cybersecurity',
  'Robotics',
  'Neuroscience',
];

export async function GET() {
  await dbConnect();
  try {
    const [proposalAreas, grantAreas] = await Promise.all([
      Proposal.distinct('researchArea'),
      Grant.distinct('researchArea'),
    ]);

    const allAreas = [...proposalAreas, ...grantAreas, ...STATIC_AREAS];
    const uniqueAreas = Array.from(new Set(allAreas))
      .filter((area) => typeof area === 'string' && area.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));

    return NextResponse.json({ success: true, areas: uniqueAreas });
  } catch (error) {
    console.error('[Research Areas API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
