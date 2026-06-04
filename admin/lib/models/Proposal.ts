import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title:                 { type: String, required: true },
  researcherName:        { type: String, required: true },
  researcherEmail:       { type: String, required: true },
  abstract:              { type: String, required: true },
  objectives:            String,
  methodology:           String,
  budget:                { type: Number, required: true },
  duration:              String,
  researchArea:          String,
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending',
  },
  assignedReviewerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Researcher' },
  assignedReviewerName:  String,
  submittedAt:           { type: Date, default: Date.now },
  updatedAt:             { type: Date, default: Date.now },
});

export default mongoose.models.Proposal || mongoose.model('Proposal', schema);
