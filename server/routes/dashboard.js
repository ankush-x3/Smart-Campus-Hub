const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Course = require('../models/Course');
const Complaint = require('../models/Complaint');
const Announcement = require('../models/Announcement');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res, next) => {
  try {
    const Announcement = require('../models/Announcement');
    const Event = require('../models/Event');
    const Complaint = require('../models/Complaint');
    const User = require('../models/User');
    const Assignment = require('../models/Assignment');

    if (req.user.role === 'admin') {
      const [totalUsers, totalStudents, totalFaculty, totalEvents, totalAnnouncements, totalComplaints, pendingComplaints] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'faculty' }),
        Event.countDocuments(),
        Announcement.countDocuments(),
        Complaint.countDocuments(),
        Complaint.countDocuments({ status: 'pending' })
      ]);
      return res.json({ success: true, data: { totalUsers, totalStudents, totalFaculty, totalEvents, totalAnnouncements, totalComplaints, pendingComplaints } });
    }

    if (req.user.role === 'faculty') {
      const [myAssignments, myEvents, totalStudents] = await Promise.all([
        Assignment.countDocuments({ faculty: req.user._id || req.user.id }),
        Event.countDocuments({ organizer: req.user._id || req.user.id }),
        User.countDocuments({ role: 'student' })
      ]);
      const assignments = await Assignment.find({ faculty: req.user._id || req.user.id });
      const pendingReviews = assignments.reduce((acc, a) => acc + (a.submissions ? a.submissions.filter(s => s.status === 'submitted').length : 0), 0);
      return res.json({ success: true, data: { myAssignments, myEvents, totalStudents, pendingReviews } });
    }

    // student
    const userId = req.user._id || req.user.id;
    const [myComplaints, registeredEvents, totalNotices, enrolledCourses] = await Promise.all([
      Complaint.countDocuments({ submittedBy: userId }),
      Event.countDocuments({ registeredUsers: userId }),
      Announcement.countDocuments(),
      Course.countDocuments({ enrolledStudents: userId })
    ]);
    return res.json({ success: true, data: { myComplaints, registeredEvents, unreadNotices: totalNotices, enrolledCourses } });
  } catch (err) { next(err); }
});

module.exports = router;
