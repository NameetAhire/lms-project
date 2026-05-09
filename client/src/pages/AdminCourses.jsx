import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../lib/api';
import { BookOpen, Trash2, Edit, Eye, EyeOff, Users, Clock, Plus } from 'lucide-react';

export default function AdminCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await coursesAPI.getAll({ limit: 100 });
      setCourses(res.data.courses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const togglePublish = async (courseId, currentState) => {
    try {
      await coursesAPI.update(courseId, { isPublished: !currentState });
      fetchCourses();
    } catch (error) {
      alert('Failed to update course');
    }
  };

  const deleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all enrollments.')) return;
    try {
      await coursesAPI.delete(courseId);
      fetchCourses();
    } catch (error) {
      alert('Failed to delete course');
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <button onClick={() => navigate('/admin/courses/add')} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Course
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Course</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Instructor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Students</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
                ) : courses.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No courses found</td></tr>
                ) : courses.map(course => (
                  <tr key={course._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt="" className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <Link to={`/courses/${course._id}`} className="font-medium text-gray-900 hover:text-primary transition-colors">{course.title}</Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="badge badge-primary">{course.category}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{course.totalDuration}h</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.instructor?.name}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => togglePublish(course._id, course.isPublished)} className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'} cursor-pointer`}>
                        {course.isPublished ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                        {course.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1"><Users className="w-4 h-4" />{course.enrollmentCount}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{course.price}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/courses/${course._id}`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"><Edit className="w-4 h-4" /></Link>
                        <button onClick={() => deleteCourse(course._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
