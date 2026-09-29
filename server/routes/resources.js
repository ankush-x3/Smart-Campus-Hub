const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/resources
// @desc    Get all resources
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let query;
    if (req.query.type) {
      query = Resource.find({ type: req.query.type });
    } else {
      query = Resource.find();
    }
    const resources = await query;
    res.status(200).json({ success: true, count: resources.length, data: resources });
  } catch (err) { next(err); }
});

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('availableSlots.bookedBy', 'name');
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, data: resource });
  } catch (err) { next(err); }
});

// @route   POST /api/resources
// @desc    Create resource
// @access  Private (admin)
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    await AuditLog.create({
      action: 'Resource Created',
      details: `Created resource: ${resource.name}`,
      user: req.user.id,
      type: 'system'
    });
    res.status(201).json({ success: true, data: resource });
  } catch (err) { next(err); }
});

// @route   PUT /api/resources/:id
// @desc    Update resource
// @access  Private (admin)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.status(200).json({ success: true, data: resource });
  } catch (err) { next(err); }
});

// @route   DELETE /api/resources/:id
// @desc    Delete resource
// @access  Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    await AuditLog.create({
      action: 'Resource Deleted',
      details: `Deleted resource: ${resource.name}`,
      user: req.user.id,
      type: 'system'
    });
    res.status(200).json({ success: true, data: {} });
  } catch (err) { next(err); }
});

// @route   POST /api/resources/:id/book
// @desc    Book a time slot
// @access  Private
router.post('/:id/book', protect, async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    const { date, startTime, endTime } = req.body;
    resource.availableSlots.push({ date, startTime, endTime, bookedBy: req.user.id, status: 'booked' });
    await resource.save();
    
    await AuditLog.create({
      action: 'Resource Booked',
      details: `Booked resource: ${resource.name}`,
      user: req.user.id,
      type: 'system'
    });
    
    res.status(200).json({ success: true, data: resource });
  } catch (err) { next(err); }
});

// @route   DELETE /api/resources/:id/book/:slotId
// @desc    Cancel booking
// @access  Private
router.delete('/:id/book/:slotId', protect, async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    const slot = resource.availableSlots.id(req.params.slotId);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    if (slot.bookedBy.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'faculty') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    slot.deleteOne();
    await resource.save();
    res.status(200).json({ success: true, data: resource });
  } catch (err) { next(err); }
});

// @route   PUT /api/resources/:id/book/:slotId/status
// @desc    Update booking status (Approve/Reject)
// @access  Private (faculty, admin)
router.put('/:id/book/:slotId/status', protect, authorize('faculty', 'admin'), async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    const slot = resource.availableSlots.id(req.params.slotId);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    
    if (req.body.status) {
      slot.status = req.body.status;
    }
    await resource.save();
    res.status(200).json({ success: true, data: resource });
  } catch (err) { next(err); }
});

module.exports = router;
