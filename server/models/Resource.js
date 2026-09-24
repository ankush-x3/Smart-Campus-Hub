const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a resource name']
  },
  type: {
    type: String,
    enum: ['classroom', 'lab', 'auditorium', 'sports', 'library'],
    required: true
  },
  capacity: {
    type: Number
  },
  building: {
    type: String,
    required: true
  },
  floor: {
    type: String
  },
  amenities: [{
    type: String
  }],
  availableSlots: [{
    date: Date,
    startTime: String,
    endTime: String,
    bookedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'maintenance'],
      default: 'available'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);
