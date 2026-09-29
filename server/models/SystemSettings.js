const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
  campusName: { type: String, default: 'Smart Campus Hub' },
  campusEmail: { type: String, default: 'admin@campus.edu' },
  allowRegistration: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  emailNotifications: { type: Boolean, default: true },
  complaintNotifications: { type: Boolean, default: true },
  eventNotifications: { type: Boolean, default: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
