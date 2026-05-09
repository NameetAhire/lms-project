import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { coursesAPI } from '../lib/api';
import { Search, Filter, ChevronRight, Clock, Users, Star, X } from 'lucide-react';

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');
  const [showFilters, setShowFilters] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (level) params.level = level;
      const res = await coursesAPI.getAll(params);
      setCourses(res.data.courses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    coursesAPI.getCategories().then(res => setCategories(res.data));
    fetchCourses();
  }, []);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (level) params.level = level;
    setSearchParams(params);
    fetchCourses();
  }, [search, category, level]);

  const clearFilters = () => {
    setSearch(''); setCategory(''); setLevel('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Courses</h1>
          <p className="text-gray-500">Discover {courses.length > 0 ? courses.length : ''} courses across various topics</p>
        </div>

        {/* Search & Filters */}
        <div className="card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="input-field pl-12" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="btn-outline flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid md:grid-cols-3 gap-4 animate-slide-up">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
                  <option value="">All Categories</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Level</label>
                <select value={level} onChange={e => setLevel(e.target.value)} className="input-field">
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={clearFilters} className="btn-ghost text-sm flex items-center gap-1">
                  <X className="w-4 h-4" /> Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Active filters */}
          {(category || level) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {category && <span className="badge badge-primary">{category} <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setCategory('')} /></span>}
              {level && <span className="badge badge-info capitalize">{level} <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setLevel('')} /></span>}
            </div>
          )}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="card h-80 animate-pulse bg-gray-50"></div>)}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <Link key={course._id} to={`/courses/${course._id}`} className="card card-hover group" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="relative h-44 overflow-hidden">
                  <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-primary">{course.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={course.instructor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'} alt="" className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-gray-500">{course.instructor?.name}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.shortDescription}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.totalDuration}h</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.enrollmentCount}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{course.rating || 4.8}</span>
                    <span className={`ml-auto badge ${course.level === 'beginner' ? 'badge-success' : course.level === 'intermediate' ? 'badge-warning' : 'badge-primary'}`}>{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                    <span className="text-xl font-bold text-gray-900">${course.price}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
