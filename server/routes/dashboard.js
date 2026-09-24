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
    let data = {};

    if (req.user.role === 'admin') {
      const users = await User.countDocuments();
      const events = await Event.countDocuments();
      const courses = await Course.countDocuments();
      const announcements = await Announcement.countDocuments();
      
      const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
      const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

      data = {
        users,
        events,
        courses,
        announcements,
        complaints: {
          pending: pendingComplaints,
          resolved: resolvedComplaints
        }
      };
    } else if (req.user.role === 'student') {
      const enrolledCourses = await Course.find({ enrolledStudents: req.user.id });
      const registeredEvents = await Event.find({ registeredUsers: req.user.id });
      const myComplaints = await Complaint.find({ submittedBy: req.user.id });

      data = {
        enrolledCoursesCount: enrolledCourses.length,
        registeredEventsCount: registeredEvents.length,
        complaintsCount: myComplaints.length,
        enrolledCourses,
        registeredEvents,
        myComplaints
      };
    } else if (req.user.role === 'faculty') {
      const myCourses = await Course.find({ instructor: req.user.id });
      const myEvents = await Event.find({ organizer: req.user.id });
      const myAnnouncements = await Announcement.find({ author: req.user.id });

      data = {
        myCoursesCount: myCourses.length,
        myEventsCount: myEvents.length,
        myAnnouncementsCount: myAnnouncements.length
      };
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
