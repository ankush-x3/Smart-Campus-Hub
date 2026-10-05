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
    
    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) return res.status(404).json({ success: false, message: 'User not found' });

    if (userToUpdate.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot demote the last admin account.' });
      }
    }

    userToUpdate.role = role;
    await userToUpdate.save(); // Avoid bypassing hooks
    
    await AuditLog.create({
      action: 'User Role Changed',
      details: `Changed role of ${userToUpdate.email} to ${role}`,
      user: req.user.id,
      type: 'user'
    });
    
    // Omit password from response
    const returnUser = userToUpdate.toObject();
    delete returnUser.password;

    res.json({ success: true, data: returnUser });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// DELETE /api/users/:id - Admin: delete user
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString() || req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) return res.status(404).json({ success: false, message: 'User not found' });

    if (userToDelete.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the last admin account.' });
      }
    }
    
    await userToDelete.deleteOne(); // updated from findByIdAndDelete
    
    await AuditLog.create({
      action: 'User Deleted',
      details: `Deleted user ${userToDelete.email}`,
      user: req.user.id,
      type: 'user'
    });
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});


// POST /api/users - Admin: create user
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role, department, year, phone } = req.body;
    if (!['student','faculty','admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }
    const user = await User.create({
      name, email, password, role, department, year, phone
    });
    await AuditLog.create({
      action: 'User Created',
      details: 'Admin created ' + user.role + ' account for ' + user.email,
      user: req.user.id,
      type: 'user'
    });
    const returnUser = user.toObject();
    delete returnUser.password;
    res.status(201).json({ success: true, data: returnUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// PUT /api/users/:id/email - Admin: change user email
router.put('/:id/email', protect, authorize('admin'), async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a new email' });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email format' });
    }
    
    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) return res.status(404).json({ success: false, message: 'User not found' });
    
    // Check if new email is already taken by ANOTHER user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && existingUser._id.toString() !== userToUpdate._id.toString()) {
      return res.status(409).json({ success: false, message: 'Email is already in use' });
    }
    
    const oldEmail = userToUpdate.email;
    userToUpdate.email = normalizedEmail;
    await userToUpdate.save(); // Avoid bypassing hooks
    
    await AuditLog.create({
      action: 'USER_EMAIL_CHANGED',
      details: 'Admin changed email for ' + userToUpdate.name + ' from ' + oldEmail + ' to ' + normalizedEmail,
      user: req.user.id,
      type: 'user'
    });
    
    // Omit password from response
    const returnUser = userToUpdate.toObject();
    delete returnUser.password;

    res.json({ success: true, data: returnUser });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
