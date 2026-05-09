import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { coursesAPI } from '../lib/api';
import { ArrowRight, Star, Users, Clock, TrendingUp, Sparkles, ChevronRight, BookOpen } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesAPI.getAll({ featured: 'true', limit: 6 })
      .then(res => setFeaturedCourses(res.data.courses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" /> New courses added weekly
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                Learn Without
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Limits</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Master new skills with expert-led courses. From coding to cloud computing, unlock your potential and advance your career.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses" className="btn-primary flex items-center gap-2 text-lg py-4 px-8">
                  Explore Courses <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/register" className="btn-outline flex items-center gap-2 text-lg py-4 px-8">
                  Start Free Trial
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12">
                {[{ value: '10K+', label: 'Students' }, { value: '50+', label: 'Courses' }, { value: '20+', label: 'Instructors' }, { value: '4.8', label: 'Avg Rating' }].map(stat => (
                  <div key={stat.label}>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Cards */}
            <div className="relative h-[500px] hidden lg:block animate-fade-in">
              <div className="absolute top-0 right-0 w-72 card p-4 animate-float shadow-clay">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Your Progress</div>
                    <div className="text-xs text-gray-500">3 courses in progress</div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-[75%]"></div></div>
              </div>

              <div className="absolute bottom-20 left-0 w-64 card p-4 animate-float shadow-clay" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />)}
                </div>
                <div className="font-semibold text-sm">React Masterclass</div>
                <div className="text-xs text-gray-500">"Best course I've taken!"</div>
              </div>

              <div className="absolute top-1/2 right-10 w-56 card p-4 animate-float shadow-clay" style={{ animationDelay: '3s' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">2,340 enrolled</span>
                </div>
                <div className="text-xs text-gray-500">This week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Courses</h2>
              <p className="text-gray-500 mt-2">Hand-picked courses by our expert instructors</p>
            </div>
            <Link to="/courses" className="btn-ghost flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="card h-80 animate-pulse bg-gray-50"></div>)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course, i) => (
                <CourseCard key={course._id} course={course} delay={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose LMS Pro Max?</h2>
            <p className="text-gray-500 mt-3">Everything you need to succeed in your learning journey</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Expert Instructors', desc: 'Learn from industry professionals with real-world experience and passion for teaching.' },
              { icon: Clock, title: 'Learn at Your Pace', desc: 'Access courses anytime, anywhere. Study around your schedule, not the other way around.' },
              { icon: Star, title: 'Certificates', desc: 'Earn recognized certificates upon completion to showcase your new skills to employers.' }
            ].map((item, i) => (
              <div key={i} className="card p-8 text-center card-hover">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-white/80 mb-8">Join thousands of students learning new skills every day. Your first course is on us!</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary font-bold py-4 px-8 rounded-xl text-lg hover:bg-gray-50 transition-colors shadow-clay">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function CourseCard({ course, delay = 0 }) {
  return (
    <div className="card card-hover group" style={{ animationDelay: `${delay * 100}ms` }}>
      <div className="relative h-48 overflow-hidden">
        <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3">
          <span className="badge badge-primary">{course.category}</span>
        </div>
        {course.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-amber-100 text-amber-700">Featured</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <img src={course.instructor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'} alt="" className="w-6 h-6 rounded-full" />
          <span className="text-sm text-gray-500">{course.instructor?.name}</span>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.totalDuration}h</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.enrollmentCount}</span>
          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />{course.rating || 4.8}</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
            {course.originalPrice > course.price && <span className="text-sm text-gray-400 line-through ml-2">₹{course.originalPrice}</span>}
          </div>
          <Link to={`/courses/${course._id}`} className="btn-primary py-2 px-4 text-sm">
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}
