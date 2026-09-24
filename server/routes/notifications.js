const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @route   GET /api/notifications/unread-count
// @desc    Get unread count for current user
router.get('/unread-count', protect, async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
    res.status(200).json({ success: true, data: { count }, message: 'Unread count fetched successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/notifications
// @desc    Get all notifications for current user
router.get('/', protect, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
      
    res.status(200).json({ success: true, data: notifications, message: 'Notifications fetched successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all as read for current user
router.put('/read-all', protect, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ success: true, data: {}, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark single notification as read
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, data: notification, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.status(200).json({ success: true, data: {}, message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/notifications
// @desc    Create notification (admin/system)
router.post('/', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'system') {
      return res.status(403).json({ success: false, message: 'Not authorized to create notifications' });
    }
    
    const { recipient, title, message, type, link, icon } = req.body;
    
    const notification = await Notification.create({
      recipient, title, message, type, link, icon
    });
    
    res.status(201).json({ success: true, data: notification, message: 'Notification created successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
