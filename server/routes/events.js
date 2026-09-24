const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    query = Event.find(JSON.parse(queryStr)).populate('organizer', 'name');

    const events = await query;
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name')
      .populate('registeredUsers', 'name avatar');
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (faculty, admin)
router.post('/', protect, authorize('faculty', 'admin'), async (req, res, next) => {
  try {
    req.body.organizer = req.user.id;
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Private (student)
router.post('/:id/register', protect, authorize('student'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    if (event.maxAttendees && event.registeredUsers.length >= event.maxAttendees) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    event.registeredUsers.push(req.user.id);
    await event.save();

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/events/:id/register
// @desc    Cancel registration
// @access  Private
router.delete('/:id/register', protect, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.registeredUsers = event.registeredUsers.filter(
      user => user.toString() !== req.user.id
    );
    await event.save();

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (faculty, admin)
router.put('/:id', protect, authorize('faculty', 'admin'), async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
