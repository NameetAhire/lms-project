const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  watchedDuration: { type: Number, default: 0 }, // seconds watched
  isCompleted: { type: Boolean, default: false },
  completedAt: Date,
  lastWatched: { type: Date, default: Date.now }
});

progressSchema.index({ user: 1, lesson: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
