require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db';

const demoUsers = [
  {
    name: 'Rahul Sharma',
    email: 'admin@lms.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    bio: 'System Administrator with full access to all features.'
  },
  {
    name: 'Priya Patel',
    email: 'instructor@lms.com',
    password: 'instructor123',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    bio: 'Senior Software Engineer with 10+ years of experience in web development. Passionate about teaching and helping students succeed in their tech careers.'
  },
  {
    name: 'Vikram Singh',
    email: 'instructor2@lms.com',
    password: 'instructor123',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram',
    bio: 'Full-stack developer and AWS certified solutions architect. I love building scalable applications and sharing knowledge with the community.'
  },
  {
    name: 'Ananya Gupta',
    email: 'student@lms.com',
    password: 'student123',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
    bio: 'Aspiring frontend developer looking to transition from design to development. Eager to learn modern web technologies!'
  },
  {
    name: 'Arjun Mehta',
    email: 'student2@lms.com',
    password: 'student123',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
    bio: 'Career changer from finance to tech. Focused on learning React and Node.js to build my own startup.'
  },
  {
    name: 'Sneha Reddy',
    email: 'student3@lms.com',
    password: 'student123',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha',
    bio: 'Computer Science student exploring cloud computing and DevOps. Looking to expand my skills beyond the classroom.'
  }
];

const demoCourses = [
  {
    title: 'Complete React Developer Course 2025',
    shortDescription: 'Master React from zero to hero with real-world projects',
    description: 'This comprehensive course takes you from the fundamentals of React to building production-ready applications. You will learn hooks, context, state management, performance optimization, testing, and deployment. By the end, you will be able to build complex, scalable web applications with confidence.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f1343aabf186?w=800',
    price: 3999,
    originalPrice: 8999,
    category: 'Web Development',
    level: 'intermediate',
    language: 'English',
    isPublished: true,
    isFeatured: true,
    tags: ['React', 'JavaScript', 'Frontend', 'Web Dev'],
    requirements: ['Basic JavaScript knowledge', 'HTML & CSS fundamentals', 'Desire to learn'],
    whatYouLearn: ['React fundamentals and JSX', 'Hooks: useState, useEffect, useContext', 'State management with Redux and Zustand', 'React Router and navigation', 'Testing with React Testing Library', 'Deployment to Vercel and Netlify'],
    totalDuration: 42
  },
  {
    title: 'Node.js Backend Development Masterclass',
    shortDescription: 'Build scalable APIs and backend services with Node.js',
    description: 'Learn to build robust, scalable backend applications with Node.js. This course covers Express, MongoDB, authentication, security best practices, deployment strategies, and more. Perfect for developers who want to become full-stack engineers.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    price: 3499,
    originalPrice: 7999,
    category: 'Web Development',
    level: 'intermediate',
    language: 'English',
    isPublished: true,
    isFeatured: true,
    tags: ['Node.js', 'Express', 'Backend', 'MongoDB', 'API'],
    requirements: ['JavaScript basics', 'Understanding of HTTP methods'],
    whatYouLearn: ['Express.js fundamentals', 'RESTful API design', 'MongoDB and Mongoose', 'JWT authentication', 'Security best practices', 'Testing backend services'],
    totalDuration: 38
  },
  {
    title: 'AWS Cloud Solutions Architect',
    shortDescription: 'Prepare for AWS Solutions Architect certification',
    description: 'Prepare for the AWS Solutions Architect Associate certification exam. This course covers all major AWS services, architecture best practices, security, pricing, and hands-on lab exercises. Includes practice exams and real-world scenarios.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    price: 5999,
    originalPrice: 12999,
    category: 'Cloud Computing',
    level: 'beginner',
    language: 'English',
    isPublished: true,
    isFeatured: true,
    tags: ['AWS', 'Cloud', 'Architecture', 'Certification'],
    requirements: ['Basic IT knowledge', 'Understanding of cloud concepts'],
    whatYouLearn: ['EC2, S3, VPC networking', 'IAM and security best practices', 'High availability architecture', 'Cost optimization strategies', 'AWS Lambda and serverless', 'Preparing for SAA-C03 exam'],
    totalDuration: 56
  },
  {
    title: 'Python for Data Science & Machine Learning',
    shortDescription: 'From Python basics to ML models with real datasets',
    description: 'Comprehensive Python course focused on data science. Learn NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow. Build actual ML projects and understand the mathematics behind algorithms.',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    price: 4999,
    originalPrice: 9999,
    category: 'Data Science',
    level: 'beginner',
    language: 'English',
    isPublished: true,
    isFeatured: false,
    tags: ['Python', 'Data Science', 'ML', 'AI', 'Pandas'],
    requirements: ['No programming experience needed', 'High school math'],
    whatYouLearn: ['Python fundamentals', 'NumPy and data manipulation', 'Pandas for data analysis', 'Data visualization', 'Machine learning basics', 'Deep learning intro'],
    totalDuration: 64
  },
  {
    title: 'UI/UX Design Fundamentals',
    shortDescription: 'Design stunning interfaces with Figma and design principles',
    description: 'Learn the principles of great UI/UX design. This course covers color theory, typography, layout design, user research, prototyping in Figma, and design systems. Create a portfolio-quality project by the end.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    price: 2999,
    originalPrice: 6999,
    category: 'Design',
    level: 'beginner',
    language: 'English',
    isPublished: true,
    isFeatured: false,
    tags: ['UI', 'UX', 'Design', 'Figma', 'Prototyping'],
    requirements: ['Creativity and eye for design', 'No design experience needed'],
    whatYouLearn: ['Design principles and theory', 'Color psychology and palettes', 'Typography mastery', 'Figma from basics to advanced', 'User research methods', 'Building a design system'],
    totalDuration: 32
  },
  {
    title: 'Docker & Kubernetes Mastery',
    shortDescription: 'Container orchestration from development to production',
    description: 'Master containerization with Docker and orchestration with Kubernetes. Learn to build, ship, and run applications in containers. Deploy and manage production-grade clusters on AWS EKS.',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
    price: 4999,
    originalPrice: 9999,
    category: 'DevOps',
    level: 'advanced',
    language: 'English',
    isPublished: true,
    isFeatured: true,
    tags: ['Docker', 'Kubernetes', 'DevOps', 'AWS', 'Containers'],
    requirements: ['Linux basics', 'Command line experience', 'Understanding of applications'],
    whatYouLearn: ['Docker fundamentals', 'Building optimized images', 'Docker Compose', 'Kubernetes architecture', 'Deploying workloads', 'Monitoring and logging'],
    totalDuration: 48
  }
];

const lessonData = {
  'Complete React Developer Course 2025': [
    { title: 'Welcome to the Course', description: 'Course overview and what you will learn', duration: 8, order: 1, isFree: true },
    { title: 'Setting Up Your Development Environment', description: 'Install VS Code, Node.js, and React developer tools', duration: 12, order: 2, isFree: true },
    { title: 'JavaScript Refresher for React', description: 'ES6+ features you need to know', duration: 25, order: 3, isFree: false },
    { title: 'React Fundamentals - JSX & Components', description: 'Understanding JSX syntax and component structure', duration: 30, order: 4, isFree: false },
    { title: 'Props and State Management', description: 'Passing data between components, useState hook', duration: 35, order: 5, isFree: false },
    { title: 'useEffect Hook Deep Dive', description: 'Side effects, cleanup, and dependency arrays', duration: 28, order: 6, isFree: false },
    { title: 'Building Your First React App', description: 'Hands-on project: Task Manager App', duration: 45, order: 7, isFree: false },
    { title: 'React Router & Navigation', description: 'Single Page Application routing', duration: 32, order: 8, isFree: false },
    { title: 'Context API & Global State', description: 'Avoid prop drilling with React Context', duration: 38, order: 9, isFree: false },
    { title: 'Final Project & Deployment', description: 'Build and deploy your portfolio project', duration: 50, order: 10, isFree: false }
  ],
  'Node.js Backend Development Masterclass': [
    { title: 'Introduction to Node.js', description: 'Why Node.js and event-driven architecture', duration: 15, order: 1, isFree: true },
    { title: 'NPM & Package Management', description: 'Creating projects and managing dependencies', duration: 12, order: 2, isFree: true },
    { title: 'Express.js Fundamentals', description: 'Building your first API server', duration: 25, order: 3, isFree: false },
    { title: 'RESTful API Design', description: 'HTTP methods, status codes, and best practices', duration: 30, order: 4, isFree: false },
    { title: 'MongoDB & Mongoose ODM', description: 'Database modeling and queries', duration: 40, order: 5, isFree: false },
    { title: 'Authentication & Authorization', description: 'JWT, bcrypt, and role-based access', duration: 35, order: 6, isFree: false },
    { title: 'Error Handling & Validation', description: 'Centralized error handling and Zod validation', duration: 20, order: 7, isFree: false },
    { title: 'API Security Best Practices', description: 'CORS, rate limiting, helmet, and sanitization', duration: 25, order: 8, isFree: false }
  ],
  'AWS Cloud Solutions Architect': [
    { title: 'AWS Cloud Essentials', description: 'Cloud concepts and AWS global infrastructure', duration: 20, order: 1, isFree: true },
    { title: 'IAM - Identity & Access Management', description: 'Users, groups, roles, and policies', duration: 30, order: 2, isFree: false },
    { title: 'EC2 - Elastic Compute Cloud', description: 'Virtual machines and instance types', duration: 45, order: 3, isFree: false },
    { title: 'S3 - Simple Storage Service', description: 'Buckets, storage classes, and lifecycle policies', duration: 35, order: 4, isFree: false },
    { title: 'VPC - Virtual Private Cloud', description: 'Networking, subnets, and security groups', duration: 50, order: 5, isFree: false },
    { title: 'High Availability Architecture', description: 'Multi-AZ deployments and load balancing', duration: 40, order: 6, isFree: false },
    { title: 'RDS & Database Services', description: 'Managed databases: PostgreSQL, MySQL, Aurora', duration: 38, order: 7, isFree: false }
  ]
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      Enrollment.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create users
    const users = await User.create(demoUsers);
    console.log(`Created ${users.length} users`);

    const instructor = users.find(u => u.role === 'instructor');
    const instructor2 = users.find(u => u.email === 'instructor2@lms.com');
    const student = users.find(u => u.email === 'student@lms.com');
    const student2 = users.find(u => u.email === 'student2@lms.com');

    // Create courses
    const createdCourses = [];
    for (let i = 0; i < demoCourses.length; i++) {
      const courseData = demoCourses[i];
      const inst = i % 2 === 0 ? instructor : instructor2;
      const course = new Course({ ...courseData, instructor: inst._id });
      await course.save();
      createdCourses.push(course);
    }
    console.log(`Created ${createdCourses.length} courses`);

    // Create lessons for each course
    for (const course of createdCourses) {
      const lessons = lessonData[course.title];
      if (lessons) {
        for (const lessonData of lessons) {
          const lesson = new Lesson({ ...lessonData, course: course._id });
          await lesson.save();
          course.lessons.push(lesson._id);
        }
        await course.save();
      }
    }
    console.log('Created lessons for all courses');

    // Create some enrollments
    const enrollments = [
      { user: student._id, course: createdCourses[0]._id, progress: 60 },
      { user: student._id, course: createdCourses[1]._id, progress: 30 },
      { user: student2._id, course: createdCourses[0]._id, progress: 100 },
      { user: student2._id, course: createdCourses[2]._id, progress: 45 }
    ];

    for (const data of enrollments) {
      const enrollment = new Enrollment(data);
      await enrollment.save();
    }
    console.log(`Created ${enrollments.length} enrollments`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📧 Demo Accounts:');
    console.log('   Admin:      admin@lms.com / admin123');
    console.log('   Instructor: instructor@lms.com / instructor123');
    console.log('   Student:    student@lms.com / student123');
    console.log('\n🌐 Start the app with: npm run dev');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
