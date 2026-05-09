import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { coursesAPI, enrollmentsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Clock, Users, Star, BookOpen, Award, CheckCircle, Play, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showWhatLearn, setShowWhatLearn] = useState(true);
  const [showReq, setShowReq] = useState(false);

  useEffect(() => {
    Promise.all([
      coursesAPI.getById(id),
      user ? enrollmentsAPI.check(id) : Promise.resolve({ data: { enrolled: false } })
    ])
      .then(([courseRes, enrollRes]) => {
        setCourse(courseRes.data);
        setEnrolled(enrollRes.data.enrolled);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await enrollmentsAPI.enroll(id);
      setEnrolled(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center"><p>Course not found</p></div>;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge bg-white/20 text-white">{course.category}</span>
                <span className="badge bg-white/20 text-white capitalize">{course.level}</span>
                <span className="badge bg-white/20 text-white">{course.language}</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-white/80 mb-6">{course.shortDescription}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {course.rating || 4.8} ({course.reviewCount || 0} reviews)</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.enrollmentCount || 0} students</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.totalDuration}h total</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.lessons?.length || 0} lessons</span>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <img src={course.instructor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'} alt="" className="w-12 h-12 rounded-full border-2 border-white/30" />
                <div>
                  <div className="font-medium">{course.instructor?.name}</div>
                  <div className="text-sm text-white/70">Instructor</div>
                </div>
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="card bg-white text-gray-900 p-6 rounded-2xl shadow-2xl">
              <img src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'} alt="" className="w-full h-48 object-cover rounded-xl mb-6" />
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-bold">${course.price}</span>
                {course.originalPrice > course.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">${course.originalPrice}</span>
                    <span className="badge badge-success">{Math.round((1 - course.price / course.originalPrice) * 100)}% off</span>
                  </>
                )}
              </div>
              {enrolled ? (
                <Link to={`/lessons/${course.lessons?.[0]?._id}`} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" /> Continue Learning
                </Link>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full flex items-center justify-center gap-2">
                  {enrolling ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Award className="w-5 h-5" /> Enroll Now</>}
                </button>
              )}
              <p className="text-center text-sm text-gray-500 mt-4">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>

            {/* What you'll learn */}
            <div className="card p-6">
              <button onClick={() => setShowWhatLearn(!showWhatLearn)} className="w-full flex items-center justify-between text-left">
                <h2 className="text-2xl font-bold text-gray-900">What You'll Learn</h2>
                {showWhatLearn ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
              </button>
              {showWhatLearn && (
                <div className="mt-4 grid md:grid-cols-2 gap-3 animate-slide-up">
                  {course.whatYouLearn?.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Requirements */}
            <div className="card p-6">
              <button onClick={() => setShowReq(!showReq)} className="w-full flex items-center justify-between text-left">
                <h2 className="text-2xl font-bold text-gray-900">Requirements</h2>
                {showReq ? <ChevronUp className="w-6 h-6 text-gray-400" /> : <ChevronDown className="w-6 h-6 text-gray-400" />}
              </button>
              {showReq && (
                <ul className="mt-4 space-y-2 animate-slide-up">
                  {course.requirements?.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Course Content */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              <div className="space-y-3">
                {course.lessons?.map((lesson, i) => (
                  <div key={lesson._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{lesson.title}</div>
                        <div className="text-sm text-gray-500">{lesson.duration} min</div>
                      </div>
                    </div>
                    {enrolled || lesson.isFree ? (
                      <Link to={`/lessons/${lesson._id}`} className="btn-primary py-2 px-4 text-sm">Watch</Link>
                    ) : (
                      <span className="badge bg-gray-200 text-gray-600 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
