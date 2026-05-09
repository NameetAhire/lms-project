import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/users/${id}`),
  getInstructors: () => api.get('/users/role/instructors')
};

export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getMyCourses: () => api.get('/courses/my/courses'),
  getCategories: () => api.get('/courses/categories/list'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  addLesson: (id, data) => api.post(`/courses/${id}/lessons`, data)
};

export const lessonsAPI = {
  getByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
  getById: (id) => api.get(`/lessons/${id}`),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  delete: (id) => api.delete(`/lessons/${id}`)
};

export const enrollmentsAPI = {
  enroll: (courseId) => api.post('/enrollments', { courseId }),
  getMy: () => api.get('/enrollments/my'),
  check: (courseId) => api.get(`/enrollments/check/${courseId}`),
  updateProgress: (id, data) => api.put(`/enrollments/${id}/progress`, data)
};

export const progressAPI = {
  complete: (lessonId, courseId) => api.post('/progress/complete', { lessonId, courseId }),
  getByCourse: (courseId) => api.get(`/progress/course/${courseId}`)
};

export const dashboardAPI = {
  admin: () => api.get('/dashboard/admin'),
  instructor: () => api.get('/dashboard/instructor'),
  student: () => api.get('/dashboard/student')
};

export default api;
