const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect, authorize } = require('../middleware/auth');

// GET /api/users - Admin: get all users
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};
    if (role && role !== 'all') query.role = role;
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users, count: users.length });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/users/stats - Admin: counts by role
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const total = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const faculty = await User.countDocuments({ role: 'faculty' });
    const admins = await User.countDocuments({ role: 'admin' });
    res.json({ success: true, data: { total, students, faculty, admins } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PUT /api/users/:id/role - Admin: change role
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student','faculty','admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await AuditLog.create({
      action: 'User Role Changed',
      details: `Changed role of ${user.email} to ${role}`,
      user: req.user.id,
      type: 'user'
    });
    
    res.json({ success: true, data: user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// DELETE /api/users/:id - Admin: delete user
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString() || req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    await AuditLog.create({
      action: 'User Deleted',
      details: `Deleted user ${user.email}`,
      user: req.user.id,
      type: 'user'
    });
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
