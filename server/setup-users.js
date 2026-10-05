require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    // 1. Create a legitimate admin
    const realAdminEmail = 'testadmin@campus.edu';
    let realAdmin = await User.findOne({ email: realAdminEmail });
    if (!realAdmin) {
      realAdmin = await User.create({
        name: 'Test Admin',
        email: realAdminEmail,
        password: 'TestAdmin@123',
        role: 'admin',
        department: 'Administration'
      });
      console.log('Legitimate Admin created:', realAdminEmail);
    } else {
      console.log('Legitimate Admin already exists:', realAdminEmail);
    }

    // 2. Remove exact demo accounts
    const demoEmails = ['admin@campus.edu', 'faculty@campus.edu', 'student@campus.edu'];
    for (const email of demoEmails) {
      const demoUser = await User.findOne({ email });
      if (demoUser) {
        await User.deleteOne({ email });
        console.log(`Deleted demo user: ${email}`);
      }
    }

    // 3. Count remaining admins
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`Total Admins remaining: ${adminCount}`);

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

fixUsers();
