const mongoose = require('mongoose');
const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date, required: true },
  totalMarks: { type: Number, default: 100 },
  attachmentUrl: { type: String },
  attachmentName: { type: String },
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date, default: Date.now },
    fileUrl: { type: String },
    fileName: { type: String },
    grade: { type: Number },
    feedback: { type: String },
    status: { type: String, enum: ['submitted','graded','late'], default: 'submitted' }
  }],
  status: { type: String, enum: ['active','closed'], default: 'active' }
}, { timestamps: true });
module.exports = mongoose.model('Assignment', AssignmentSchema);
