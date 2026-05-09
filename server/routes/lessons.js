const express = require('express');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { auth, instructorOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get lessons for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .sort('order');
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single lesson
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('resources');
    if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lesson
router.put('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    Object.assign(lesson, req.body);
    await lesson.save();
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lesson
router.delete('/:id', auth, instructorOrAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found.' });

    // Remove from course
    await Course.updateOne(
      { _id: lesson.course },
      { $pull: { lessons: lesson._id } }
    );

    res.json({ message: 'Lesson deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
