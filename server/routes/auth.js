const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_key_here_change_in_production', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: user
  });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, department, year, phone } = req.body;
    const role = 'student';

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      year,
      phone
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.trim().toLowerCase();

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const allowedFields = ['name', 'department', 'year', 'phone', 'profileImage'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    if (updates.name && updates.name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Name cannot be empty' });
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});


// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }
    
    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
});




// @route   PUT /api/auth/change-email
// @desc    Change user email
// @access  Private
router.put('/change-email', protect, async (req, res, next) => {
  try {
    const { currentPassword, newEmail } = req.body;
    
    if (!currentPassword || !newEmail) {
      return res.status(400).json({ success: false, message: 'Please provide current password and new email' });
    }
    
    // Normalize new email
    const normalizedEmail = newEmail.trim().toLowerCase();
    
    // Simple regex check
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email format' });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }
    
    // Check if new email is already taken by ANOTHER user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(409).json({ success: false, message: 'Email is already in use' });
    }
    
    // Update email
    const oldEmail = user.email;
    user.email = normalizedEmail;
    await user.save();
    
    // Audit Log
    const AuditLog = require('../models/AuditLog');
    await AuditLog.create({
      action: 'EMAIL_CHANGED',
      details: 'User changed their account email from ' + oldEmail + ' to ' + normalizedEmail,
      user: req.user.id,
      type: 'user'
    });
    
    // Return safe user object
    const returnUser = user.toObject();
    delete returnUser.password;

    res.status(200).json({ success: true, message: 'Email changed successfully', data: returnUser });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
