import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { lessonsAPI, progressAPI, coursesAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ArrowLeft, ArrowRight, BookOpen, FileText, ExternalLink, Play } from 'lucide-react';

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const lessonRes = await lessonsAPI.getById(id);
        setLesson(lessonRes.data);

        const courseRes = await coursesAPI.getById(lessonRes.data.course);
        setCourse(courseRes.data);
        setLessons(courseRes.data.lessons || []);

        const progressRes = await progressAPI.getByCourse(lessonRes.data.course);
        const isCompleted = progressRes.data.some(p => p.lesson === id && p.isCompleted);
        setCompleted(isCompleted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const markComplete = async () => {
    try {
      await progressAPI.complete(id, lesson.course);
      setCompleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const currentIndex = lessons.findIndex(l => l._id === id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!lesson) return <div className="min-h-screen flex items-center justify-center"><p>Lesson not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to={`/courses/${lesson.course}`} className="btn-ghost flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Course
          </Link>
          <div className="flex items-center gap-3">
            {!completed && (
              <button onClick={markComplete} className="btn-secondary flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Mark Complete
              </button>
            )}
            {completed && (
              <span className="badge badge-success flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Completed</span>
            )}
          </div>
        </div>

        {/* Video Placeholder */}
        <div className="card overflow-hidden mb-6">
          <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative">
            {lesson.videoUrl ? (
              <video src={lesson.videoUrl} controls className="w-full h-full" />
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-white" />
                </div>
                <p className="text-white/60">Video content would be here</p>
                <p className="text-white/40 text-sm mt-1">Duration: {lesson.duration} minutes</p>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Info */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span className="badge badge-primary">{course?.title}</span>
            <span>Lesson {currentIndex + 1} of {lessons.length}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
          <p className="text-gray-600">{lesson.description}</p>

          {lesson.content && (
            <div className="mt-6 prose prose-indigo max-w-none">
              <div className="p-4 rounded-xl bg-gray-50 text-gray-700 whitespace-pre-wrap">{lesson.content}</div>
            </div>
          )}
        </div>

        {/* Resources */}
        {lesson.resources?.length > 0 && (
          <div className="card p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Resources</h3>
            <div className="space-y-2">
              {lesson.resources.map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-gray-700">{res.title}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevLesson ? (
            <Link to={`/lessons/${prevLesson._id}`} className="btn-outline flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> {prevLesson.title}
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link to={`/lessons/${nextLesson._id}`} className="btn-primary flex items-center gap-2">
              {nextLesson.title} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link to={`/courses/${lesson.course}`} className="btn-primary flex items-center gap-2">
              Finish Course <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
