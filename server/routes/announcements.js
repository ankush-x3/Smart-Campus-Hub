const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const announcements = await Announcement.find()
      .populate('author', 'name avatar')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Announcement.countDocuments();

    res.status(200).json({
      success: true,
      count: announcements.length,
      pagination: {
        page,
        limit,
        total
      },
      data: announcements
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/announcements/:id
// @desc    Get single announcement
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate('author', 'name avatar');
    
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // Increment views
    announcement.views += 1;
    await announcement.save();

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/announcements
// @desc    Create announcement
// @access  Private (faculty, admin)
router.post('/', protect, authorize('faculty', 'admin'), async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    const announcement = await Announcement.create(req.body);
    res.status(201).json({
      success: true,
      data: announcement
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement
// @access  Private (faculty, admin)
router.put('/:id', protect, authorize('faculty', 'admin'), async (req, res, next) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // Make sure user is announcement owner or admin
    if (announcement.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this announcement' });
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement
// @access  Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    await announcement.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
