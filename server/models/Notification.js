const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['announcement','event','assignment','complaint','system','community'], default: 'system' },
  isRead: { type: Boolean, default: false },
  link: { type: String },
  icon: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Notification', NotificationSchema);
