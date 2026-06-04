import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title:       String,
  type:        { type: String, enum: ['funding', 'proposal', 'performance', 'grant'] },
  data:        mongoose.Schema.Types.Mixed,
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model('Report', schema);
