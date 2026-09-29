const mongoose = require('mongoose');
const LostFoundSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['electronics','books','clothing','documents','keys','other'], default: 'other' },
  location: { type: String },
  imageUrl: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active','resolved'], default: 'active' },
  contactInfo: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('LostFound', LostFoundSchema);
