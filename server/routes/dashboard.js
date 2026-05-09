const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get admin dashboard stats
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, recentEnrollments] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Enrollment.find().populate('user', 'name email avatar')
        .populate('course', 'title')
        .sort('-enrolledAt')
        .limit(10)
    ]);

    const coursesByCategory = await Course.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        activeInstructors: await User.countDocuments({ role: 'instructor' }),
        activeStudents: await User.countDocuments({ role: 'student' })
      },
      recentEnrollments,
      coursesByCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get instructor dashboard stats
router.get('/instructor', auth, async (req, res) => {
  try {
    const myCourses = await Course.find({ instructor: req.user._id });

    const enrollments = await Enrollment.find({
      course: { $in: myCourses.map(c => c._id) }
    }).populate('user', 'name email');

    const totalStudents = enrollments.length;
    const totalRevenue = enrollments.length * myCourses.reduce((sum, c) => sum + (c.price || 0), 0);

    res.json({
      stats: {
        totalCourses: myCourses.length,
        totalStudents,
        totalRevenue,
        avgRating: myCourses.length > 0 ?
          myCourses.reduce((sum, c) => sum + (c.rating || 0), 0) / myCourses.length : 0
      },
      courses: myCourses,
      recentEnrollments: enrollments.sort((a, b) => b.enrolledAt - a.enrolledAt).slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student dashboard stats
router.get('/student', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title thumbnail totalDuration level category')
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name avatar' }
      })
      .sort('-enrolledAt');

    const stats = {
      enrolledCourses: enrollments.length,
      completedCourses: enrollments.filter(e => e.completedAt).length,
      inProgress: enrollments.filter(e => !e.completedAt && e.progress > 0).length,
      totalProgress: enrollments.length > 0 ?
        Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length) : 0
    };

    res.json({ stats, enrollments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
