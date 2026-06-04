import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  proposalId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  proposalTitle:   String,
  reviewerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Reviewer' },
  reviewerName:    String,
  score:           { type: Number, min: 1, max: 100 },
  comments:        String,
  recommendation:  { type: String, enum: ['approve', 'reject', 'revise'] },
  status:          { type: String, enum: ['pending', 'submitted'], default: 'pending' },
  reviewedAt:      { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model('Review', schema);
