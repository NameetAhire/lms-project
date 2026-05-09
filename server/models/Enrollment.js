const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 }, // percentage 0-100
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  enrolledAt: { type: Date, default: Date.now },
  completedAt: Date,
  certificateUrl: { type: String, default: '' }
});

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
