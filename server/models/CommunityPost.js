const mongoose = require('mongoose');
const CommunityPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['general','academic','events','sports','lost-found','marketplace'], default: 'general' },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  imageUrl: String,
  isPinned: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
