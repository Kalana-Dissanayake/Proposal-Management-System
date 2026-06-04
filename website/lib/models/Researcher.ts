import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true },
  institution:   String,
  createdAt:     { type: Date, default: Date.now },
});

export default mongoose.models.Researcher || mongoose.model('Researcher', schema);
