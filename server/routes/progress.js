const express = require('express');
const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mark lesson as completed
router.post('/complete', auth, async (req, res) => {
  try {
    const { lessonId, courseId } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      lesson: lessonId
    });

    if (!progress) {
      progress = new Progress({
        user: req.user._id,
        lesson: lessonId,
        course: courseId
      });
    }

    progress.isCompleted = true;
    progress.completedAt = new Date();
    await progress.save();

    // Update enrollment progress
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (enrollment) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }

      const course = await require('../models/Course').findById(courseId);
      const progressPercent = (enrollment.completedLessons.length / course.lessons.length) * 100;
      enrollment.progress = Math.round(progressPercent);

      if (progressPercent === 100) {
        enrollment.completedAt = new Date();
      }

      await enrollment.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get progress for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const progress = await Progress.find({
      user: req.user._id,
      course: req.params.courseId
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
