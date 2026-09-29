const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['user', 'system', 'complaint', 'event', 'notice', 'setting'], default: 'system' }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
