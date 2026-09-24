const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth');

// @route   GET /api/resources
// @desc    Get all resources
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let query;
    if (req.query.type) {
      query = Resource.find({ type: req.query.type, isActive: true });
    } else {
      query = Resource.find({ isActive: true });
    }

    const resources = await query;
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('availableSlots.bookedBy', 'name');
    
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/resources/:id/book
// @desc    Book a time slot
// @access  Private
router.post('/:id/book', protect, async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const { date, startTime, endTime } = req.body;

    // Add new slot (simplified for demo, in production check overlaps)
    resource.availableSlots.push({
      date,
      startTime,
      endTime,
      bookedBy: req.user.id,
      status: 'booked'
    });

    await resource.save();

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/resources/:id/book/:slotId
// @desc    Cancel booking
// @access  Private
router.delete('/:id/book/:slotId', protect, async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const slot = resource.availableSlots.id(req.params.slotId);
    
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    if (slot.bookedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    slot.deleteOne();
    await resource.save();

    res.status(200).json({
      success: true,
      data: resource
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
