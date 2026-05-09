import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../lib/api';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

export default function AddCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [steps, setSteps] = useState([
    { title: '', description: '', duration: '', order: 1, isFree: false }
  ]);

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    thumbnail: '',
    price: '',
    originalPrice: '',
    category: 'Web Development',
    level: 'beginner',
    language: 'English',
    requirements: '',
    whatYouLearn: '',
    tags: ''
  });

  const categories = ['Web Development', 'Cloud Computing', 'Data Science', 'Design', 'DevOps', 'Mobile Development', 'Programming', 'Business'];
  const levels = ['beginner', 'intermediate', 'advanced'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleStepChange = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, { title: '', description: '', duration: '', order: steps.length + 1, isFree: false }]);
  };

  const removeStep = (index) => {
    if (steps.length === 1) return;
    const updated = steps.filter((_, i) => i !== index);
    updated.forEach((s, i) => (s.order = i + 1));
    setSteps(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const courseData = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        requirements: form.requirements.split('\n').filter(r => r.trim()),
        whatYouLearn: form.whatYouLearn.split('\n').filter(w => w.trim()),
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t),
        lessons: steps.filter(s => s.title.trim())
      };

      await coursesAPI.create(courseData);
      navigate('/admin/courses');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Course</h1>
          <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2">
            <X className="w-5 h-5" /> Cancel
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                <input name="title" value={form.title} onChange={handleChange} required className="input-field" placeholder="e.g. Complete React Developer Course" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required className="input-field" placeholder="One line summary (max 100 chars)" maxLength={100} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input-field" placeholder="Detailed course description..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                  <select name="level" value={form.level} onChange={handleChange} className="input-field">
                    {levels.map(l => <option key={l} value={l} style={{ textTransform: 'capitalize' }}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select name="language" value={form.language} onChange={handleChange} className="input-field">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>English + Hindi</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Media & Pricing */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Media & Pricing</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="input-field" placeholder="https://images.unsplash.com/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required className="input-field" placeholder="2999" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                  <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} className="input-field" placeholder="5999" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange} className="input-field" placeholder="React, JavaScript, Frontend" />
              </div>
            </div>
          </div>

          {/* What you'll learn */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What You'll Learn</h2>
            <textarea name="whatYouLearn" value={form.whatYouLearn} onChange={handleChange} rows={5} className="input-field" placeholder="Enter each point on a new line, e.g.:&#10;React fundamentals and JSX&#10;State management with Redux&#10;Deployment to production" />
            <p className="text-xs text-gray-500 mt-1">Each line becomes a bullet point</p>
          </div>

          {/* Requirements */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={3} className="input-field" placeholder="Enter each requirement on a new line" />
          </div>

          {/* Lessons */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Course Content (Lessons)</h2>
              <button type="button" onClick={addStep} className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Lesson
              </button>
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">{step.order}</span>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={step.title}
                        onChange={e => handleStepChange(index, 'title', e.target.value)}
                        className="input-field col-span-2"
                        placeholder="Lesson title"
                        required
                      />
                      <input
                        type="text"
                        value={step.description}
                        onChange={e => handleStepChange(index, 'description', e.target.value)}
                        className="input-field col-span-2"
                        placeholder="Lesson description"
                      />
                      <input
                        type="number"
                        value={step.duration}
                        onChange={e => handleStepChange(index, 'duration', e.target.value)}
                        className="input-field"
                        placeholder="Duration (min)"
                      />
                      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={step.isFree}
                          onChange={e => handleStepChange(index, 'isFree', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        Free preview
                      </label>
                    </div>
                    {steps.length > 1 && (
                      <button type="button" onClick={() => removeStep(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost py-3 px-6">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary py-3 px-8 flex items-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload className="w-5 h-5" />}
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}