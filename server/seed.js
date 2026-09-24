require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const Event = require('./models/Event');
const Course = require('./models/Course');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_campus_hub');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear db
    await User.deleteMany();
    await Announcement.deleteMany();
    await Event.deleteMany();
    await Course.deleteMany();

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin'
    });

    const faculty = await User.create({
      name: 'Faculty User',
      email: 'faculty@campus.edu',
      password: 'faculty123',
      role: 'faculty',
      department: 'Computer Science'
    });

    const student = await User.create({
      name: 'Student User',
      email: 'student@campus.edu',
      password: 'student123',
      role: 'student',
      department: 'Computer Science',
      year: 2
    });

    // Create Announcement
    await Announcement.create({
      title: 'Welcome to Smart Campus Hub',
      content: 'We are glad to launch the new smart campus hub application.',
      category: 'general',
      author: admin._id,
      isPinned: true
    });

    // Create Event
    await Event.create({
      title: 'Tech Symposium 2024',
      description: 'Annual tech symposium featuring latest trends in AI and Web Dev.',
      date: new Date('2024-10-15T09:00:00'),
      endDate: new Date('2024-10-15T17:00:00'),
      location: 'Main Auditorium',
      category: 'seminar',
      organizer: faculty._id,
      maxAttendees: 200
    });

    // Create Course
    await Course.create({
      title: 'Web Development Bootcamp',
      code: 'CS301',
      description: 'Learn modern web development using MERN stack.',
      instructor: faculty._id,
      credits: 4,
      department: 'Computer Science',
      semester: 'Fall 2024',
      maxStudents: 50
    });

    console.log('Data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

seedData();
