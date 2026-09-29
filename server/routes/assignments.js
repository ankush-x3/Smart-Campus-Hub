const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/auth');

// @route   GET /api/assignments
// @desc    Get assignments (faculty sees theirs, students see ones for their courses)
router.get('/', protect, async (req, res, next) => {
  try {
    let assignments;
    if (req.user.role === 'faculty') {
      assignments = await Assignment.find({ faculty: req.user.id })
        .populate('course', 'title')
        .populate('faculty', 'name');
    } else if (req.user.role === 'student') {
      const query = {};
      if (req.query.course) {
        query.course = req.query.course;
      }
      assignments = await Assignment.find(query)
        .populate('course', 'title')
        .populate('faculty', 'name');
    } else {
      assignments = await Assignment.find()
        .populate('course', 'title')
        .populate('faculty', 'name');
    }
    res.status(200).json({ success: true, data: assignments, message: 'Assignments fetched successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/assignments/:id
// @desc    Get single assignment with submissions
router.get('/:id', protect, async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title')
      .populate('faculty', 'name')
      .populate('submissions.student', 'name email');
    
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    res.status(200).json({ success: true, data: assignment, message: 'Assignment fetched successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/assignments
// @desc    Create an assignment (faculty/admin)
router.post('/', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to create assignments' });
    }
    
    if (!req.body.faculty) {
      req.body.faculty = req.user.id;
    }
    
    const assignment = await Assignment.create(req.body);
    
    await AuditLog.create({
      action: 'Assignment Created',
      details: `Created assignment: ${assignment.title}`,
      user: req.user.id,
      type: 'system'
    });
    
    res.status(201).json({ success: true, data: assignment, message: 'Assignment created successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update an assignment (faculty)
router.put('/:id', protect, async (req, res, next) => {
  try {
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    if (req.user.role !== 'admin' && assignment.faculty.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this assignment' });
    }
    
    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({ success: true, data: assignment, message: 'Assignment updated successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete an assignment (faculty/admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    if (req.user.role !== 'admin' && assignment.faculty.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this assignment' });
    }
    
    await assignment.deleteOne();
    
    await AuditLog.create({
      action: 'Assignment Deleted',
      details: `Deleted assignment: ${assignment.title}`,
      user: req.user.id,
      type: 'system'
    });
    
    res.status(200).json({ success: true, data: {}, message: 'Assignment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/assignments/:id/submit
// @desc    Submit an assignment (student)
router.post('/:id/submit', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can submit assignments' });
    }
    
    const { fileUrl, fileName } = req.body;
    
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    const existingSubmissionIndex = assignment.submissions.findIndex(
      s => s.student.toString() === req.user.id
    );
    
    let isLate = new Date() > new Date(assignment.dueDate);
    
    const submissionData = {
      student: req.user.id,
      fileUrl,
      fileName,
      status: isLate ? 'late' : 'submitted',
      submittedAt: Date.now()
    };
    
    if (existingSubmissionIndex !== -1) {
      assignment.submissions[existingSubmissionIndex] = {
        ...assignment.submissions[existingSubmissionIndex],
        ...submissionData
      };
    } else {
      assignment.submissions.push(submissionData);
    }
    
    await assignment.save();
    res.status(200).json({ success: true, data: assignment, message: 'Assignment submitted successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/assignments/:id/grade/:submissionId
// @desc    Grade a submission (faculty)
router.put('/:id/grade/:submissionId', protect, async (req, res, next) => {
  try {
    const { grade, feedback } = req.body;
    
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    if (req.user.role !== 'admin' && assignment.faculty.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to grade this assignment' });
    }
    
    const submission = assignment.submissions.id(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    
    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';
    
    await assignment.save();
    
    await AuditLog.create({
      action: 'Assignment Graded',
      details: `Graded submission for assignment: ${assignment.title}`,
      user: req.user.id,
      type: 'system'
    });
    
    res.status(200).json({ success: true, data: assignment, message: 'Submission graded successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/assignments/:id/submissions
// @desc    List all submissions for assignment (faculty)
router.get('/:id/submissions', protect, async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('submissions.student', 'name email');
      
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    if (req.user.role !== 'admin' && assignment.faculty.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view submissions' });
    }
    
    res.status(200).json({ success: true, data: assignment.submissions, message: 'Submissions fetched successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
