const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendEmail, isEmailConfigured } = require('../utils/sendEmail');
const { uploadImageBuffer } = require('../utils/cloudinary');

// Configure multer memory storage for secure in-memory buffer handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP image formats are supported'));
    }
  }
});

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
// @desc    Get current logged in user with real activity stats
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = user.toObject();

    // Attach student activity stats safely
    try {
      const Event = require('../models/Event');
      const Complaint = require('../models/Complaint');
      const CommunityPost = require('../models/CommunityPost');
      const Course = require('../models/Course');

      const [eventsCount, complaintsCount, postsCount, coursesCount] = await Promise.all([
        Event.countDocuments({ registeredUsers: user._id }),
        Complaint.countDocuments({ submittedBy: user._id }),
        CommunityPost.countDocuments({ author: user._id }),
        Course.countDocuments(user.department ? { department: new RegExp(`^${user.department}$`, 'i') } : {})
      ]);

      userData.stats = {
        courses: coursesCount,
        events: eventsCount,
        complaints: complaintsCount,
        posts: postsCount
      };
    } catch (statErr) {
      userData.stats = { courses: 0, events: 0, complaints: 0, posts: 0 };
    }

    res.status(200).json({
      success: true,
      data: userData
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
    const allowedFields = ['name', 'department', 'year', 'phone', 'profileImage', 'coverImage', 'bio', 'avatar'];
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

// @route   POST /api/auth/profile/photo
// @desc    Upload profile avatar (supports multipart file or base64 data URI)
// @access  Private
router.post('/profile/photo', protect, (req, res, next) => {
  upload.single('photo')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'File upload error' });
    }
    try {
      let buffer = null;
      let mimetype = 'image/jpeg';

      if (req.file) {
        buffer = req.file.buffer;
        mimetype = req.file.mimetype;
      } else if (req.body && req.body.image) {
        const matches = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ success: false, message: 'Invalid image format. Expected base64 data URI.' });
        }
        mimetype = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        return res.status(400).json({ success: false, message: 'Please provide an image file or data URI' });
      }

      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'Image size cannot exceed 5MB' });
      }

      const { url } = await uploadImageBuffer(buffer, mimetype, 'smart-campus-hub/avatars');

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profileImage: url, avatar: url },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        data: user,
        url
      });
    } catch (uploadErr) {
      next(uploadErr);
    }
  });
});

// @route   DELETE /api/auth/profile/photo
// @desc    Remove profile picture
// @access  Private
router.delete('/profile/photo', protect, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: '', avatar: 'default.jpg' },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: 'Profile picture removed successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/profile/cover
// @desc    Upload profile cover image (supports multipart file or base64 data URI)
// @access  Private
router.post('/profile/cover', protect, (req, res, next) => {
  upload.single('cover')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || 'File upload error' });
    }
    try {
      let buffer = null;
      let mimetype = 'image/jpeg';

      if (req.file) {
        buffer = req.file.buffer;
        mimetype = req.file.mimetype;
      } else if (req.body && req.body.image) {
        const matches = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ success: false, message: 'Invalid cover image format' });
        }
        mimetype = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        return res.status(400).json({ success: false, message: 'Please provide a cover image file or data URI' });
      }

      if (buffer.length > 5 * 1024 * 1024) {
        return res.status(400).json({ success: false, message: 'Cover image size cannot exceed 5MB' });
      }

      const { url } = await uploadImageBuffer(buffer, mimetype, 'smart-campus-hub/covers');

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { coverImage: url },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Cover image updated successfully',
        data: user,
        url
      });
    } catch (uploadErr) {
      next(uploadErr);
    }
  });
});

// @route   DELETE /api/auth/profile/cover
// @desc    Remove profile cover image
// @access  Private
router.delete('/profile/cover', protect, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { coverImage: '' },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: 'Cover image removed successfully',
      data: user
    });
  } catch (err) {
    next(err);
  }
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

// @route   POST /api/auth/forgotpassword
// @desc    Forgot password - generate reset token & email link
// @access  Public
const forgotPasswordHandler = async (req, res, next) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }
    email = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    // Check if email service is configured
    if (!isEmailConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Password reset via email is currently unavailable because SMTP email service is not configured on this server. Please contact your campus administrator or configure SMTP credentials.'
      });
    }

    const user = await User.findOne({ email });

    // OWASP Best Practice: Return generic message if user not found to prevent account enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.'
      });
    }

    // Generate token and save hashed token to user model
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Construct reset URL
    const clientUrl = process.env.CLIENT_URL || 'https://smart-campus-hub-delta.vercel.app';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `Hello ${user.name},\n\nYou requested a password reset for your Smart Campus Hub account.\nClick the link below or copy and paste it into your browser to reset your password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-top: 0;">Smart Campus Hub</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>You requested a password reset for your Smart Campus Hub account.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </p>
        <p style="color: #64748b; font-size: 14px;">This link will expire in 15 minutes.</p>
        <p style="color: #64748b; font-size: 14px;">If you did not request this reset, you can safely ignore this email and your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Direct Link: <a href="${resetUrl}" style="color: #4f46e5;">${resetUrl}</a></p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request — Smart Campus Hub',
        message,
        html
      });

      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.'
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please contact administrator or try again later.'
      });
    }
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/auth/resetpassword/:resettoken
// @desc    Reset password using token
// @access  Public
const resetPasswordHandler = async (req, res, next) => {
  try {
    const { password } = req.body;
    const token = req.params.resettoken || req.params.token;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Reset token is required' });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Hash token to compare with database hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset link'
      });
    }

    // Set new password (pre-save hook hashes with bcryptjs)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.'
    });
  } catch (err) {
    next(err);
  }
};

router.post('/forgotpassword', forgotPasswordHandler);
router.post('/forgot-password', forgotPasswordHandler);
router.put('/resetpassword/:resettoken', resetPasswordHandler);
router.put('/reset-password/:token', resetPasswordHandler);

module.exports = router;
