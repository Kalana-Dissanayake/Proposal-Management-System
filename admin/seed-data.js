const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// We define minimal schemas here to avoid import issues outside Next.js
const AdminUserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  subject: { type: String },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
});

const GrantSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  fundingAmount: { type: Number },
  fundingBody: { type: String },
  researchArea: { type: String },
  deadline: { type: Date },
  status: { type: String, default: 'open' },
  createdAt: { type: Date, default: Date.now },
});

const ReviewerSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  department: { type: String },
  institution: { type: String },
  researchAreas: [String],
  bio: { type: String },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
const Grant = mongoose.models.Grant || mongoose.model('Grant', GrantSchema);
const Reviewer = mongoose.models.Reviewer || mongoose.model('Reviewer', ReviewerSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Admin User
    await AdminUser.deleteMany({});
    const adminPassword = await bcrypt.hash('admin123', 10);
    await AdminUser.create({
      name: 'Super Admin',
      email: 'admin@admin.com',
      password: adminPassword,
      role: 'superadmin'
    });
    console.log('Admin user created (admin@admin.com / admin123)');

    // 2. Contact Messages
    await ContactMessage.deleteMany({});
    console.log('Contact messages cleared');

    // 3. Grants
    await Grant.deleteMany({});
    await Grant.insertMany([
      { title: 'AI Research Excellence Grant', description: 'Funding for advanced artificial intelligence research.', fundingAmount: 150000, fundingBody: 'National Science Foundation', deadline: new Date('2026-12-31'), status: 'open', researchArea: 'Artificial Intelligence' },
      { title: 'Renewable Energy Innovation', description: 'Supporting sustainable energy technologies.', fundingAmount: 200000, fundingBody: 'Department of Energy', deadline: new Date('2026-10-15'), status: 'open', researchArea: 'Renewable Energy' },
      { title: 'Biomedical Science Fellowship', description: 'Research into new medical treatments.', fundingAmount: 75000, fundingBody: 'Health Institute', deadline: new Date('2026-08-01'), status: 'closed', researchArea: 'Biomedical Science' }
    ]);
    console.log('Grants created');

    // 4. Reviewers
    await Reviewer.deleteMany({});
    await Reviewer.insertMany([
      { name: 'Dr. Alan Turing', email: 'alan@university.edu', phone: '555-1234', department: 'Computer Science', institution: 'University of Technology', researchAreas: ['Artificial Intelligence', 'Cryptography'], bio: 'Pioneer in computer science.', status: 'active' },
      { name: 'Dr. Marie Curie', email: 'marie@science.edu', phone: '555-5678', department: 'Physics', institution: 'Institute of Science', researchAreas: ['Physics', 'Chemistry'], bio: 'Nobel laureate.', status: 'active' },
      { name: 'Dr. Nikola Tesla', email: 'nikola@engineering.edu', phone: '555-9012', department: 'Electrical Engineering', institution: 'Global Engineering Institute', researchAreas: ['Renewable Energy', 'Electromagnetism'], bio: 'Inventor and electrical engineer.', status: 'inactive' }
    ]);
    console.log('Reviewers created');

    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    process.exit(0);
  }
}

seed();
