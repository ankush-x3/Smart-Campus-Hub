const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/complaints
// @desc    Get complaints
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    let query = {};
    
    // If student or faculty, only show their own complaints
    if (req.user.role !== 'admin') {
      query.submittedBy = req.user.id;
    }

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name')
      .populate('comments.author', 'name avatar');
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (req.user.role !== 'admin' && complaint.submittedBy._id.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/complaints
// @desc    Submit complaint
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    req.body.submittedBy = req.user.id;
    const complaint = await Complaint.create(req.body);
    res.status(201).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status
// @access  Private (admin)
router.put('/:id/status', protect, authorize('admin'), async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const updates = {
      status: req.body.status,
      assignedTo: req.body.assignedTo || complaint.assignedTo
    };

    if (req.body.status === 'resolved') {
      updates.resolvedAt = Date.now();
    }

    complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    
    await AuditLog.create({
      action: 'Complaint Status Changed',
      details: `Complaint ${complaint._id} status updated to ${req.body.status}`,
      user: req.user.id,
      type: 'complaint'
    });

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/complaints/:id/comment
// @desc    Add comment to complaint
// @access  Private
router.post('/:id/comment', protect, async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (req.user.role !== 'admin' && complaint.submittedBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const newComment = {
      text: req.body.text,
      author: req.user.id
    };

    complaint.comments.push(newComment);
    await complaint.save();

    res.status(201).json({
      success: true,
      data: complaint
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
