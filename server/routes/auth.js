const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const user = new User({ name, email, password, role: role || 'student' });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = ['name', 'avatar', 'bio'];
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
