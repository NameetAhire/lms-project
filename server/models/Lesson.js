const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // in minutes
  order: { type: Number, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['pdf', 'link', 'video', 'file'] }
  }],
  isFree: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

lessonSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
