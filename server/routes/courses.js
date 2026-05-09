const express = require('express');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const { auth, adminOnly, instructorOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all courses (public)
router.get('/', async (req, res) => {
  try {
    const {
      category,
      level,
      search,
      featured,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .populate('lessons', 'duration')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Course.distinct('category', { isPublished: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate({
        path: 'lessons',
        select: 'title description duration order isFree',
        options: { sort: { order: 1 } }
      });

    if (!course) return res.status(404).json({ error: 'Course not found.' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create course (instructor/admin)
router.post('/', auth, instructorOrAdmin, async (req, res) => {
  try {
    const { lessons, ...courseData } = req.body;
    const course = new Course({ ...courseData, instructor: req.user._id });
    await course.save();

    // Create lessons if provided
    if (lessons && Array.isArray(lessons) && lessons.length > 0) {
      for (const lessonData of lessons) {
        const lesson = new Lesson({ ...lessonData, course: course._id });
        await lesson.save();
        course.lessons.push(lesson._id);
      }
      await course.save();
    }

    const populatedCourse = await Course.findById(course._id)
      .populate('instructor', 'name avatar')
      .populate('lessons', 'title description duration order isFree');

    res.status(201).json(populatedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete course
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    // Delete associated lessons and enrollments
    await Lesson.deleteMany({ course: req.params.id });
    await Enrollment.deleteMany({ course: req.params.id });

    res.json({ message: 'Course deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add lesson to course
router.post('/:id/lessons', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const lesson = new Lesson({ ...req.body, course: course._id });
    await lesson.save();

    course.lessons.push(lesson._id);
    course.totalDuration = course.lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
    await course.save();

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my courses (instructor)
router.get('/my/courses', auth, async (req, res) => {
  try {
    const query = { instructor: req.user._id };
    if (req.user.role === 'admin') delete query.instructor;

    const courses = await Course.find(query)
      .populate('lessons', 'duration')
      .sort('-createdAt');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
