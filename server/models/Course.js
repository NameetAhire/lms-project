const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  price: { type: Number, default: 0 },
  originalPrice: { type: Number, default: 0 },
  category: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  language: { type: String, default: 'English' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  totalDuration: { type: Number, default: 0 }, // in minutes
  enrollmentCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  requirements: [{ type: String }],
  whatYouLearn: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);
