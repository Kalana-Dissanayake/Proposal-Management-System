import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  phone:         String,
  department:    String,
  institution:   String,
  researchAreas: [String],
  bio:           String,
  status:        { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt:     { type: Date, default: Date.now },
});

export default mongoose.models.Researcher || mongoose.model('Researcher', schema);
