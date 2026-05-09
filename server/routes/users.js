const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');
const { auth, adminOnly, instructorOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user (admin only - for adding instructors/admins)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['admin', 'instructor'].includes(role)) {
      return res.status(400).json({ error: 'Only admin or instructor roles can be created via this endpoint.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role (admin)
router.put('/:id/role', auth, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'instructor', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get instructors list
router.get('/role/instructors', async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('name email avatar bio');
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
