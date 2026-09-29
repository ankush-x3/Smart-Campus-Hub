require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Connecting to Atlas...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connection successful!');
    console.log('Database Name:', conn.connection.name);
    
    // Check if the database has collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Collections count:', collections.length);
    if (collections.length > 0) {
      console.log('Collections:', collections.map(c => c.name).join(', '));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
