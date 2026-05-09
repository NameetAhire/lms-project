import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Start your learning journey today</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-50 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field pl-12" placeholder="John Doe" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field pl-12" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field pl-12 pr-12" placeholder="Min 6 characters" required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field">
                <option value="student">Learn new skills (Student)</option>
                <option value="instructor">Teach courses (Instructor)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
