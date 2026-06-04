const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const ContactMessageSchema = new mongoose.Schema({}, { strict: false });
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);

async function clear() {
  await mongoose.connect(process.env.MONGODB_URI);
  await ContactMessage.deleteMany({});
  console.log('Contact messages cleared');
  process.exit(0);
}
clear();
