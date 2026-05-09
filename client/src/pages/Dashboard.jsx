import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI, enrollmentsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, TrendingUp, Award, Clock, Play, ChevronRight, BarChart3, Users, DollarSign, Star } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user.role === 'admin' ? 'admin' : user.role === 'instructor' ? 'instructor' : 'student';
    dashboardAPI[endpoint]()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            {user.role === 'admin' ? 'Manage your platform' : user.role === 'instructor' ? 'Track your teaching performance' : 'Continue your learning journey'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {user.role === 'student' && data?.stats && (
            <>
              <StatCard icon={BookOpen} value={data.stats.enrolledCourses} label="Enrolled Courses" color="primary" />
              <StatCard icon={TrendingUp} value={data.stats.inProgress} label="In Progress" color="secondary" />
              <StatCard icon={Award} value={data.stats.completedCourses} label="Completed" color="green" />
              <StatCard icon={BarChart3} value={`${data.stats.totalProgress}%`} label="Avg Progress" color="accent" />
            </>
          )}
          {user.role === 'instructor' && data?.stats && (
            <>
              <StatCard icon={BookOpen} value={data.stats.totalCourses} label="My Courses" color="primary" />
              <StatCard icon={Users} value={data.stats.totalStudents} label="Total Students" color="secondary" />
              <StatCard icon={DollarSign} value={`₹${data.stats.totalRevenue}`} label="Revenue" color="green" />
              <StatCard icon={Star} value={data.stats.avgRating.toFixed(1)} label="Avg Rating" color="amber" />
            </>
          )}
          {user.role === 'admin' && data?.stats && (
            <>
              <StatCard icon={Users} value={data.stats.totalUsers} label="Total Users" color="primary" />
              <StatCard icon={BookOpen} value={data.stats.totalCourses} label="Total Courses" color="secondary" />
              <StatCard icon={Users} value={data.stats.activeStudents} label="Students" color="green" />
              <StatCard icon={Users} value={data.stats.activeInstructors} label="Instructors" color="accent" />
            </>
          )}
        </div>

        {/* Content based on role */}
        {user.role === 'student' && data?.enrollments && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> My Courses</h2>
            {data.enrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet</p>
                <Link to="/courses" className="btn-primary">Browse Courses</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.enrollments.map(enrollment => (
                  <div key={enrollment._id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <img src={enrollment.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt="" className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{enrollment.course?.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>{enrollment.course?.instructor?.name}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{enrollment.course?.totalDuration}h</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{enrollment.progress}%</div>
                      <Link to={enrollment.completedAt ? `/courses/${enrollment.course?._id}` : `/courses/${enrollment.course?._id}`} className="btn-primary py-2 px-4 text-sm mt-2">
                        {enrollment.completedAt ? 'Review' : enrollment.progress > 0 ? 'Continue' : 'Start'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(user.role === 'instructor' || user.role === 'admin') && data?.courses && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> My Courses</h2>
              {user.role === 'instructor' && <Link to="/admin/courses/add" className="btn-primary text-sm py-2 px-4">Create Course</Link>}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.courses.map(course => (
                <Link key={course._id} to={`/courses/${course._id}`} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                      <span className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>{course.isPublished ? 'Published' : 'Draft'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span><Users className="w-4 h-4 inline" /> {course.enrollmentCount}</span>
                    <span><Clock className="w-4 h-4 inline" /> {course.totalDuration}h</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {(data?.recentEnrollments?.length > 0 || data?.recentEnrollments?.length > 0) && (
          <div className="card p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {(data.recentEnrollments || []).slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <img src={item.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'} alt="" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm"><span className="font-medium">{item.user?.name || 'User'}</span> enrolled in <span className="text-primary">{item.course?.title}</span></p>
                    <p className="text-xs text-gray-500">{new Date(item.enrolledAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  const colors = { primary: 'from-primary/10 to-primary/5', secondary: 'from-secondary/10 to-secondary/5', green: 'from-green-100 to-green-50', accent: 'from-accent/10 to-accent/5', amber: 'from-amber-100 to-amber-50' };
  return (
    <div className="card p-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 text-${color === 'amber' ? 'amber-500' : color + '-500'}`} />
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
