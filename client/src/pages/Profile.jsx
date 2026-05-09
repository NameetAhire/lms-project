import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../lib/api';
import { User, Mail, Lock, Camera, Save, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatar: user?.avatar || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Avatar */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={form.avatar || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="" className="w-24 h-24 rounded-full border-4 border-primary/20" />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"><Camera className="w-4 h-4" /></button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 capitalize">{user?.role}</p>
              <p className="text-sm text-gray-400 mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="card p-6">
          {error && <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-50 text-red-600 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}
          {success && <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-green-50 text-green-600 text-sm"><AlertCircle className="w-4 h-4" />Profile updated successfully!</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field pl-12" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={user?.email} className="input-field pl-12 bg-gray-50" disabled />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field" rows={4} placeholder="Tell us about yourself..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
              <div className="relative">
                <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="url" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} className="input-field pl-12" placeholder="https://..." />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
