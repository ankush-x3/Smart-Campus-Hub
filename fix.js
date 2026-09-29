const fs = require('fs');
const content = fs.readFileSync('server/routes/admin.js', 'utf8');
const cleanContent = content.split('module.exports = router;')[0];
const newRoute = `
// @route   POST /api/admin/users
// @desc    Create a new user from admin dashboard
// @access  Private (Admin)
router.post('/users', async (req, res, next) => {
  try {
    const { name, email, password, role, department, year, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    // Create user (password is automatically hashed by User model pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      department,
      year,
      phone
    });

    await AuditLog.create({
      action: 'User Created',
      details: 'Admin created ' + user.role + ' account for ' + user.email,
      user: req.user.id,
      type: 'user'
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
`;
fs.writeFileSync('server/routes/admin.js', cleanContent + newRoute);
