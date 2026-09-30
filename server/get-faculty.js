const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/smart_campus_hub')
  .then(async () => {
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({ role: 'faculty' });
    console.log(user.email);
    process.exit(0);
  });
