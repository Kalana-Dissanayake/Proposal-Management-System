import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  subject:     String,
  message:     { type: String, required: true },
  isRead:      { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', schema);
