const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  date: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  category: {
    type: String,
    enum: ['academic', 'cultural', 'sports', 'workshop', 'seminar'],
    required: [true, 'Please specify a category']
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  maxAttendees: {
    type: Number
  },
  registeredUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  imageUrl: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);
