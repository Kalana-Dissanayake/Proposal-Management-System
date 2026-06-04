import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name:      { type: String, default: 'Administrator' },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AdminUser || mongoose.model('AdminUser', schema);
