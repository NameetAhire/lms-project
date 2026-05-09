import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonView from './pages/LessonView';
import Dashboard from './pages/Dashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import Profile from './pages/Profile';
import AddCourse from './pages/AddCourse';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="lessons/:id" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
            <Route path="admin/courses" element={<ProtectedRoute roles={['admin', 'instructor']}><AdminCourses /></ProtectedRoute>} />
            <Route path="admin/courses/add" element={<ProtectedRoute roles={['admin', 'instructor']}><AddCourse /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}