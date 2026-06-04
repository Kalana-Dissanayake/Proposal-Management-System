import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title:         { type: String, required: true },
  description:   { type: String, required: true },
  fundingAmount: { type: Number, required: true },
  fundingBody:   String,
  researchArea:  String,
  eligibility:   String,
  deadline:      { type: Date, required: true },
  status:        { type: String, enum: ['open', 'closed', 'upcoming'], default: 'open' },
  createdAt:     { type: Date, default: Date.now },
});

export default mongoose.models.Grant || mongoose.model('Grant', schema);
