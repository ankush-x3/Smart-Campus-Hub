const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/courses
// @desc    Get all active courses
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find({ isActive: true }).populate('instructor', 'name department');
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email department')
      .populate('enrolledStudents', 'name email');
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/courses
// @desc    Create course
// @access  Private (faculty, admin)
router.post('/', protect, authorize('faculty', 'admin'), async (req, res, next) => {
  try {
    req.body.instructor = req.user.id;
    const course = await Course.create(req.body);
    res.status(201).json({
      success: true,
      data: course
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in course
// @access  Private (student)
router.post('/:id/enroll', protect, authorize('student'), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ success: false, message: 'Course is full' });
    }

    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/courses/:id/enroll
// @desc    Unenroll from course
// @access  Private (student)
router.delete('/:id/enroll', protect, authorize('student'), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      id => id.toString() !== req.user.id
    );
    await course.save();

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (faculty, admin)
router.put('/:id', protect, authorize('faculty', 'admin'), async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
