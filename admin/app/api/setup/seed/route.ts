import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AdminUser from '@/lib/models/AdminUser';
import Researcher from '@/lib/models/Researcher';
import Grant from '@/lib/models/Grant';
import Proposal from '@/lib/models/Proposal';
import Review from '@/lib/models/Review';
import ContactMessage from '@/lib/models/ContactMessage';
import bcrypt from 'bcryptjs';

export async function POST() {
  await dbConnect();

  try {
    const existing = await AdminUser.countDocuments();
    if (existing > 0) {
      return NextResponse.json({ error: 'Already seeded' }, { status: 400 });
    }

    const password = process.env.ADMIN_PASSWORD || 'Admin@123';
    const email = process.env.ADMIN_EMAIL || 'admin@research.com';

    await AdminUser.create({
      name: 'Administrator',
      email,
      password: bcrypt.hashSync(password, 12),
    });

    const researchers = await Researcher.insertMany([
      { name: 'Dr. Alice Smith', email: 'alice@univ.edu', department: 'Computer Science', institution: 'Tech University', researchAreas: ['AI', 'Machine Learning'] },
      { name: 'Dr. Bob Jones', email: 'bob@univ.edu', department: 'Physics', institution: 'Science Institute', researchAreas: ['Quantum Computing'] },
      { name: 'Dr. Charlie Brown', email: 'charlie@univ.edu', department: 'Biology', institution: 'Bio Lab', researchAreas: ['Genetics', 'Bioinformatics'] },
      { name: 'Dr. Diana Prince', email: 'diana@univ.edu', department: 'Medicine', institution: 'Health Care Center', researchAreas: ['Public Health'] },
      { name: 'Dr. Evan Wright', email: 'evan@univ.edu', department: 'Engineering', institution: 'Engineering College', researchAreas: ['Robotics', 'AI'] },
    ]);

    await Grant.insertMany([
      { title: 'AI in Healthcare 2026', description: 'Funding for AI applications in medical diagnosis.', fundingAmount: 150000, fundingBody: 'National Health Institute', researchArea: 'AI', eligibility: 'PhD researchers', deadline: new Date('2026-10-01'), status: 'open' },
      { title: 'Quantum Tech Initiative', description: 'Advancing quantum computing hardware.', fundingAmount: 200000, fundingBody: 'Tech Foundation', researchArea: 'Quantum Computing', eligibility: 'University faculty', deadline: new Date('2026-11-15'), status: 'open' },
      { title: 'Genomics Research Grant', description: 'Next-gen sequencing projects.', fundingAmount: 100000, fundingBody: 'Bio Council', researchArea: 'Genetics', eligibility: 'Postdocs', deadline: new Date('2026-09-30'), status: 'open' },
      { title: 'Robotics for Space', description: 'Autonomous robots for space exploration.', fundingAmount: 250000, fundingBody: 'Space Agency', researchArea: 'Robotics', eligibility: 'Open to all', deadline: new Date('2025-12-31'), status: 'closed' },
      { title: 'Climate Change Analytics', description: 'Data analysis for climate trends.', fundingAmount: 50000, fundingBody: 'Global Earth Fund', researchArea: 'Data Science', eligibility: 'Non-profits', deadline: new Date('2025-06-30'), status: 'closed' },
      { title: 'Future of Education Tech', description: 'Ed-tech innovations.', fundingAmount: 75000, fundingBody: 'Education Trust', researchArea: 'EdTech', eligibility: 'K-12 educators', deadline: new Date('2027-01-01'), status: 'upcoming' },
    ]);

    const proposals = await Proposal.insertMany([
      { title: 'Early Cancer Detection using Deep Learning', researcherName: researchers[0].name, researcherEmail: researchers[0].email, abstract: 'Using CNNs to detect tumors.', budget: 50000, duration: '12 months', researchArea: 'AI', status: 'pending' },
      { title: 'Quantum Cryptography Protocol', researcherName: researchers[1].name, researcherEmail: researchers[1].email, abstract: 'New secure protocol.', budget: 80000, duration: '24 months', researchArea: 'Quantum Computing', status: 'approved' },
      { title: 'CRISPR Gene Editing Efficacy', researcherName: researchers[2].name, researcherEmail: researchers[2].email, abstract: 'Evaluating off-target effects.', budget: 120000, duration: '36 months', researchArea: 'Genetics', status: 'under_review' },
      { title: 'Telemedicine App for Rural Areas', researcherName: researchers[3].name, researcherEmail: researchers[3].email, abstract: 'Improving access to care.', budget: 30000, duration: '6 months', researchArea: 'Public Health', status: 'rejected' },
      { title: 'Swarm Robotics for Search and Rescue', researcherName: researchers[4].name, researcherEmail: researchers[4].email, abstract: 'Deploying drone swarms.', budget: 90000, duration: '18 months', researchArea: 'Robotics', status: 'pending' },
      { title: 'NLP for Indigenous Languages', researcherName: 'Unknown', researcherEmail: 'unknown@test.com', abstract: 'Translating rare languages.', budget: 40000, duration: '12 months', researchArea: 'AI', status: 'pending' },
      { title: 'Ocean Microplastics Analysis', researcherName: 'Unknown2', researcherEmail: 'unknown2@test.com', abstract: 'Water sampling tech.', budget: 60000, duration: '12 months', researchArea: 'Environment', status: 'approved' },
      { title: 'Renewable Energy Grid Optimization', researcherName: 'Unknown3', researcherEmail: 'unknown3@test.com', abstract: 'Smart grid algorithms.', budget: 70000, duration: '18 months', researchArea: 'Energy', status: 'under_review' },
    ]);

    await Review.insertMany([
      { proposalId: proposals[2]._id, proposalTitle: proposals[2].title, reviewerId: researchers[0]._id, reviewerName: researchers[0].name, score: 8, comments: 'Solid methodology.', recommendation: 'approve', status: 'submitted' },
      { proposalId: proposals[7]._id, proposalTitle: proposals[7].title, reviewerId: researchers[1]._id, reviewerName: researchers[1].name, score: 4, comments: 'Needs more detail.', recommendation: 'revise', status: 'submitted' },
      { proposalId: proposals[0]._id, proposalTitle: proposals[0].title, reviewerId: researchers[2]._id, reviewerName: researchers[2].name, status: 'pending' },
      { proposalId: proposals[4]._id, proposalTitle: proposals[4].title, reviewerId: researchers[3]._id, reviewerName: researchers[3].name, status: 'pending' },
    ]);

    await ContactMessage.insertMany([
      { name: 'John Doe', email: 'john@example.com', subject: 'Grant Inquiry', message: 'When is the next deadline?', isRead: false },
      { name: 'Jane Smith', email: 'jane@example.com', subject: 'Login Issue', message: 'I cannot log in to my account.', isRead: false },
      { name: 'Test User', email: 'test@example.com', subject: 'Feedback', message: 'Great system!', isRead: true },
    ]);

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    console.error('[Seed Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
