import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin/users' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to continue your learning journey</p>
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
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field pl-12 pr-12" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
          </div>

          {/* Demo accounts */}
          <div className="mt-6 p-4 rounded-xl bg-gray-50">
            <p className="text-xs font-medium text-gray-500 mb-3">Demo Accounts:</p>
            <div className="space-y-2 text-xs">
              <DemoAccount email="admin@lms.com" password="admin123" role="Admin" />
              <DemoAccount email="instructor@lms.com" password="instructor123" role="Instructor" />
              <DemoAccount email="student@lms.com" password="student123" role="Student" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoAccount({ email, password, role }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-white">
      <div>
        <span className="font-medium text-gray-700">{role}:</span>
        <span className="text-gray-500 ml-1">{email}</span>
      </div>
      <button type="button" onClick={() => navigator.clipboard.writeText(password)} className="text-primary hover:underline">Copy pass</button>
    </div>
  );
}
