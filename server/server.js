require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route files
const auth = require('./routes/auth');
const announcements = require('./routes/announcements');
const events = require('./routes/events');
const courses = require('./routes/courses');
const complaints = require('./routes/complaints');
const resources = require('./routes/resources');
const dashboard = require('./routes/dashboard');
const assignments = require('./routes/assignments');
const notifications = require('./routes/notifications');
const community = require('./routes/community');
const users = require('./routes/users');
const lostfound = require('./routes/lostfound');
const admin = require('./routes/admin');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({ origin: ['https://smart-campus-hub-delta.vercel.app', 'http://localhost:5173'], credentials: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/announcements', announcements);
app.use('/api/events', events);
app.use('/api/courses', courses);
app.use('/api/complaints', complaints);
app.use('/api/resources', resources);
app.use('/api/dashboard', dashboard);
app.use('/api/assignments', assignments);
app.use('/api/notifications', notifications);
app.use('/api/community', community);
app.use('/api/users', users);
app.use('/api/lostfound', lostfound);
app.use('/api/admin', admin);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

