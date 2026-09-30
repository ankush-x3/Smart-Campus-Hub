const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://singhankush1097_db_user:furfFX2OVOnsuSkJ@ac-cdhnw0c-shard-00-00.lssa4pt.mongodb.net:27017,ac-cdhnw0c-shard-00-01.lssa4pt.mongodb.net:27017,ac-cdhnw0c-shard-00-02.lssa4pt.mongodb.net:27017/Smart_Campus_Hub?ssl=true&replicaSet=atlas-zdcz54-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Smart-Campus-Hub');
    console.log('Connected to MongoDB');
    
    const admin = await User.findOne({ role: 'admin' });
    console.log('Admin user:', admin ? admin.email : 'Not found');
    
    const faculty = await User.findOne({ role: 'faculty' });
    console.log('Faculty user:', faculty ? faculty.email : 'Not found');
    
    const student = await User.findOne({ role: 'student' });
    console.log('Student user:', student ? student.email : 'Not found');
    
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
checkUsers();
