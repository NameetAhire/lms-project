import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LayoutDashboard, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMobileOpen(false); };

  const navItems = [
    { to: '/', label: 'Home', icon: BookOpen },
    { to: '/courses', label: 'Courses', icon: BookOpen },
    ...(user ? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin/users', label: 'Users', icon: Users }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin/courses', label: 'Courses', icon: Settings }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-clay">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">LMS<span className="text-primary">Pro</span></span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link key={item.to} to={item.to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === item.to ? 'bg-primary text-white' : 'text-gray-600 hover:bg-primary/5 hover:text-primary'}`}>
                  <item.icon className="w-4 h-4 inline mr-1.5" />{item.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full border-2 border-primary/20" />
                    <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">{user.role}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"><LogOut className="w-5 h-5" /></button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost">Sign In</Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={`block px-4 py-3 rounded-xl text-sm font-medium ${location.pathname === item.to ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <item.icon className="w-4 h-4 inline mr-2" />{item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex-1 btn-outline text-sm py-2 text-center">Profile</Link>
                    <button onClick={handleLogout} className="flex-1 btn-ghost text-sm py-2 text-red-500">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-outline text-sm py-2 text-center">Sign In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-sm py-2 text-center">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main><Outlet /></main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">LMS<span className="text-primary">Pro</span></span>
              </div>
              <p className="text-gray-400 text-sm">Learn without limits. Master new skills and advance your career with our expert-led courses.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/courses" className="hover:text-white transition-colors">Browse Courses</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Become an Instructor</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">My Learning</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/courses?category=Web+Development" className="hover:text-white transition-colors">Web Development</Link></li>
                <li><Link to="/courses?category=Cloud+Computing" className="hover:text-white transition-colors">Cloud Computing</Link></li>
                <li><Link to="/courses?category=Data+Science" className="hover:text-white transition-colors">Data Science</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 LMS Pro Max. All rights reserved. Built for AWS Cloud Deployment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
