const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
async function drop() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully');
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
drop();
