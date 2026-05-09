const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Enroll in a course
router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course.' });
    }

    const enrollment = new Enrollment({
      user: req.user._id,
      course: courseId
    });
    await enrollment.save();

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my enrollments
router.get('/my', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title thumbnail instructor totalDuration level')
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name avatar' }
      })
      .sort('-enrolledAt');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check enrollment status
router.get('/check/:courseId', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId
    });
    res.json({ enrolled: !!enrollment, enrollment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update progress
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { completedLessons } = req.body;

    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found.' });
    }

    enrollment.completedLessons = completedLessons;

    const course = await Course.findById(enrollment.course);
    const progress = (completedLessons.length / course.lessons.length) * 100;
    enrollment.progress = Math.round(progress);

    if (progress === 100) {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
