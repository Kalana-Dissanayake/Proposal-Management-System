import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title:                 { type: String, required: true },
  submitterId:           { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher', required: true },
  researcherName:        { type: String, required: true },
  researcherEmail:       { type: String, required: true },
  detailedProposalFile:  { type: String, required: true },
  budget:                { type: Number, required: true },
  duration:              String,
  researchArea:          String,
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending',
  },
  assignedReviewerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Reviewer' },
  assignedReviewerName:  String,
  score:                 { type: Number },
  comments:              { type: String },
  submittedAt:           { type: Date, default: Date.now },
  updatedAt:             { type: Date, default: Date.now },
});

export default mongoose.models.Proposal || mongoose.model('Proposal', schema);
