# Cloud-Native Learning Management System (LMS)

## CS509 - Enterprise Technology Lab (ETL) Mini Project Report

---

### Team Information

| Field | Details |
|-------|---------|
| **Project Title** | Cloud-Native Learning Management System (LMS) for Remote Education |
| **Domain** | Education (Cloud Computing) |
| **Platform** | AWS / MongoDB Atlas / Docker |
| **Team Size** | [Insert team size] |
| **Duration** | 6 Weeks |

---

## 1. Problem Definition

### 1.1 Background
Traditional Learning Management Systems (LMS) often face challenges with scalability, accessibility, and cost-effectiveness. Educational institutions in regions like India need affordable, scalable e-learning platforms that support multiple user roles (students, instructors, administrators) with features like course management, enrollment tracking, and progress monitoring.

### 1.2 Problem Statement
Develop a cloud-native Learning Management System that enables:
- Role-based access for students, instructors, and administrators
- Course creation and management with multimedia content
- Student enrollment and progress tracking
- Scalable deployment on AWS cloud infrastructure
- Cost-effective pricing in local currency (INR)

### 1.3 Objectives
1. Build a responsive, immersive frontend with React and Tailwind CSS
2. Develop a RESTful API backend with Express.js and MongoDB
3. Implement JWT-based authentication with role-based authorization
4. Containerize application using Docker for cloud deployment
5. Ensure scalability and performance for concurrent users

### 1.4 Innovation & Impact
- Indian market localization with INR pricing and Indian names
- Cloud-native architecture ready for AWS deployment
- Containerized microservices architecture
- Role-based access control with JWT authentication

---

## 2. Architecture Design

### 2.1 System Architecture

```mermaid
flowchart TB
    subgraph Client["Frontend Layer (React + Vite)"]
        A1[React App<br/>Port 5173]
        A2[Tailwind CSS<br/>Lucide Icons]
        A3[Auth Context<br/>JWT Token]
    end

    subgraph Nginx["Reverse Proxy / Load Balancer"]
        N1[Nginx<br/>Port 80/443]
    end

    subgraph Backend["Backend Layer (Express.js)"]
        B1[Auth Routes<br/>/api/auth]
        B2[User Routes<br/>/api/users]
        B3[Course Routes<br/>/api/courses]
        B4[Enrollment Routes<br/>/api/enrollments]
        B5[Progress Routes<br/>/api/progress]
        B6[Dashboard Routes<br/>/api/dashboard]
    end

    subgraph Database["Database Layer (MongoDB)"]
        D1[Users Collection]
        D2[Courses Collection]
        D3[Enrollments Collection]
        D4[Lessons Collection]
        D5[Progress Collection]
    end

    subgraph Cloud["AWS Cloud Infrastructure"]
        subgraph ECS["AWS ECS / EC2"]
            B1 --> B2 --> B3 --> B4 --> B5 --> B6
        end
        subgraph Atlas["MongoDB Atlas"]
            D1 --> D2 --> D3 --> D4 --> D5
        end
        subgraph S3["AWS S3 / CloudFront"]
            C1[Static Assets<br/>Images/Videos]
        end
    end

    A1 --> N1 --> B1
    B1 --> B2 --> B3
    B3 --> D1
    B4 --> D2
    D2 --> D3
```

### 2.2 Application Architecture

```mermaid
flowchart LR
    subgraph Users
        Student[Student<br/>Enroll, Learn, Track]
        Instructor[Instructor<br/>Create, Manage, View]
        Admin[Admin<br/>Manage Users, Courses, Platform]
    end

    subgraph API["Express.js REST API"]
        Auth[JWT Auth]
        RBAC[Role-Based Access]
        CRUD[CRUD Operations]
        Validation[Input Validation]
    end

    subgraph Data["MongoDB Atlas"]
        M1[Users<br/>name, email, role]
        M2[Courses<br/>title, price, lessons]
        M3[Enrollments<br/>student, course, progress]
        M4[Lessons<br/>title, content, duration]
    end

    Student --> Auth --> RBAC --> CRUD --> M1
    Instructor --> Auth --> RBAC --> CRUD --> M2
    Admin --> Auth --> RBAC --> CRUD --> M3
```

### 2.3 Deployment Architecture (AWS)

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Browser[Browser / Mobile]
    end

    subgraph AWS["AWS Cloud"]
        subgraph CDN["CloudFront + S3"]
            S3[S3 Bucket<br/>Frontend Build]
            CF[CloudFront<br/>CDN Distribution]
        end

        subgraph Backend["ECS Fargate"]
            BE[Express.js<br/>Backend API<br/>Port 5000]
        end

        subgraph Database["Data Layer"]
            MA[MongoDB Atlas<br/>M0 Free Tier<br/>or M10]
        end

        subgraph Auth["Authentication"]
            JWT[JWT Tokens<br/>7-day expiry]
            BCRYPT[bcryptjs<br/>Password Hashing]
        end

        subgraph Security["Security"]
            SG[Security Groups]
            HTTPS[HTTPS / SSL]
            CORS[CORS Configuration]
        end
    end

    Browser --> CF --> S3
    Browser --> HTTPS --> BE --> SG
    BE --> MA
    BE --> JWT --> BCRYPT
```

### 2.4 Database Schema

```mermaid
erDiagram
    USER ||--o{ COURSE : "creates"
    USER ||--o{ ENROLLMENT : "enrolls in"
    COURSE ||--o{ ENROLLMENT : "has"
    COURSE ||--o{ LESSON : "contains"
    USER ||--o{ PROGRESS : "tracks"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        enum role "admin|instructor|student"
        string avatar
        string bio
        date createdAt
    }

    COURSE {
        ObjectId _id PK
        string title
        string description
        string thumbnail
        number price
        string category
        enum level "beginner|intermediate|advanced"
        ObjectId instructor FK
        ObjectId[] lessons
        number totalDuration
        number enrollmentCount
        boolean isPublished
        boolean isFeatured
        string[] tags
    }

    LESSON {
        ObjectId _id PK
        string title
        string description
        string content
        string videoUrl
        number duration
        number order
        ObjectId course FK
        boolean isFree
    }

    ENROLLMENT {
        ObjectId _id PK
        ObjectId user FK
        ObjectId course FK
        number progress
        ObjectId[] completedLessons
        date enrolledAt
        date completedAt
    }

    PROGRESS {
        ObjectId _id PK
        ObjectId user FK
        ObjectId lesson FK
        ObjectId course FK
        number watchedDuration
        boolean isCompleted
        date lastWatched
    }
```

### 2.5 Component Architecture

```mermaid
flowchart TB
    subgraph Frontend["React Frontend"]
        direction TB
        P1[Pages<br/>Home, Login, Register<br/>Courses, Dashboard<br/>Admin, Profile]
        P2[Components<br/>Layout, Navbar, Footer]
        P3[Context<br/>AuthContext]
        P4[API Layer<br/>Axios + Interceptors]
    end

    subgraph Backend["Express.js Backend"]
        direction TB
        R1[Routes<br/>auth, users, courses<br/>enrollments, progress]
        R2[Middleware<br/>Auth, Admin, Instructor]
        R3[Models<br/>User, Course, Lesson<br/>Enrollment, Progress]
    end

    subgraph Database["MongoDB"]
        direction TB
        D1[Collections<br/>Users, Courses, Lessons<br/>Enrollments, Progress]
    end

    P1 --> P2 --> P3 --> P4
    P4 --> R1 --> R2 --> R3
    R3 --> D1
```

### 2.6 Cloud Services Used

| Service | Purpose | AWS Equivalent |
|---------|---------|----------------|
| React (Vite) | Frontend Framework | S3 + CloudFront |
| Express.js | Backend API | ECS Fargate / EC2 |
| MongoDB | Database | MongoDB Atlas |
| Docker | Containerization | ECS / ECR |
| JWT | Authentication | Cognito / Custom |
| Nginx | Reverse Proxy | ALB |

---

## 3. Implementation

### 3.1 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React.js | 18.3.1 |
| **Frontend Build** | Vite | 5.4.8 |
| **Styling** | Tailwind CSS | 3.4.13 |
| **Routing** | React Router | 6.26.2 |
| **HTTP Client** | Axios | 1.7.7 |
| **Icons** | Lucide React | 0.441.0 |
| **Backend** | Node.js / Express | 20.x |
| **Database** | MongoDB / Mongoose | Latest |
| **Authentication** | JWT + bcryptjs | - |
| **Dev Tools** | Nodemon, Concurrently | - |
| **Containerization** | Docker | - |
| **Deployment** | Docker Compose | - |

### 3.2 Features Implemented

**User Management:**
- [x] User registration with role selection (student/instructor)
- [x] JWT-based login/logout
- [x] Profile management
- [x] Password change functionality
- [x] Role-based access control (RBAC)

**Course Management:**
- [x] Course creation (admin/instructor)
- [x] Course listing with filters (category, level, search)
- [x] Course detail view with lessons
- [x] Course publish/unpublish toggle
- [x] Course deletion (admin)

**Enrollment & Progress:**
- [x] Course enrollment
- [x] Progress tracking per lesson
- [x] Mark lesson as complete
- [x] Overall course progress percentage

**Admin Features:**
- [x] User management (view, update role, delete)
- [x] Add new instructors/admins
- [x] Course management (all courses)
- [x] Dashboard with platform statistics

**Dashboard (Role-based):**
- [x] Student: enrolled courses, progress, recent activity
- [x] Instructor: my courses, students, revenue
- [x] Admin: total users, courses, active students/instructors

### 3.3 API Endpoints

```
Authentication:
  POST /api/auth/register     - Register new user
  POST /api/auth/login        - Login
  GET  /api/auth/me           - Get current user
  PUT  /api/auth/profile      - Update profile
  PUT  /api/auth/password     - Change password

Users:
  GET  /api/users             - List all users (admin)
  POST /api/users             - Create user (admin)
  PUT  /api/users/:id/role    - Update user role (admin)
  DELETE /api/users/:id       - Delete user (admin)
  GET  /api/users/role/instructors - List instructors

Courses:
  GET  /api/courses           - List courses (public)
  GET  /api/courses/:id       - Get course details
  POST /api/courses           - Create course (instructor/admin)
  PUT  /api/courses/:id       - Update course
  DELETE /api/courses/:id     - Delete course (admin)
  POST /api/courses/:id/lessons - Add lesson

Enrollments:
  POST /api/enrollments       - Enroll in course
  GET  /api/enrollments/my    - My enrollments
  GET  /api/enrollments/check/:courseId - Check enrollment
  PUT  /api/enrollments/:id/progress - Update progress

Progress:
  POST /api/progress/complete - Mark lesson complete
  GET  /api/progress/course/:courseId - Get course progress

Dashboard:
  GET /api/dashboard/admin    - Admin stats
  GET /api/dashboard/instructor - Instructor stats
  GET /api/dashboard/student  - Student stats
```

### 3.4 Security Implementation

```javascript
// JWT Authentication Middleware
- Token verification on protected routes
- User attached to request object
- Role-based authorization checks

// Password Security
- bcryptjs with salt rounds
- Never stored in plain text

// API Security
- CORS configured for frontend origin
- Input validation
- Error handling middleware
```

### 3.5 Docker Deployment

```yaml
# docker-compose.yml structure
services:
  mongodb:
    image: mongo:7
    ports: 27017
    volumes: mongodb_data

  backend:
    build: ./server
    ports: 5000
    environment:
      - MONGO_URI=mongodb://mongodb:27017/lms_db
      - JWT_SECRET=${JWT_SECRET}
    depends_on: mongodb

  frontend:
    build: ./client
    ports: 80
    depends_on: backend
```

---

## 4. Cloud Deployment Strategy

### 4.1 AWS Deployment Options

**Option 1: EC2 + Docker (Recommended for Learning)**
```
1. Launch EC2 instance (t3.medium)
2. Install Docker & Docker Compose
3. Clone repository
4. Configure .env with MongoDB Atlas
5. Run: docker-compose up -d
6. Configure Security Groups (80, 443)
```

**Option 2: ECS Fargate (Production)**
```
1. Push images to ECR
2. Create ECS Task Definition
3. Deploy using docker-compose.yml
4. Configure ALB for load balancing
5. Enable HTTPS with ACM certificate
```

**Option 3: Amplify (Frontend) + ECS (Backend)**
```
Frontend: AWS Amplify (auto-deploy from Git)
Backend: ECS Fargate
Database: MongoDB Atlas (M10 cluster)
```

### 4.2 MongoDB Atlas Configuration
```
1. Create free cluster at mongodb.com/cloud/atlas
2. Create database user with read/write permissions
3. Whitelist IP 0.0.0.0/0 for development
4. Use connection string: mongodb+srv://user:pass@cluster.mongodb.net/lms_db
```

---

## 5. Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Port conflicts (5000, 5173) | Kill existing processes before starting servers |
| Environment variables not loading | Ensure .env file exists in server directory |
| MongoDB connection failures | Check MongoDB service is running, verify connection string |
| CORS errors | Configure CLIENT_URL in .env to match frontend URL |
| Docker not available locally | Use cloud deployment (AWS EC2) for production |

---

## 6. Future Enhancements

1. **Payment Integration** - Razorpay/Paytm for course purchases
2. **Video Streaming** - AWS MediaConvert for video lessons
3. **Real-time Features** - Socket.io for live chat/Q&A
4. **Analytics Dashboard** - AWS QuickSight for learning analytics
5. **CDN Distribution** - CloudFront for global content delivery
6. **Email Notifications** - AWS SES for enrollment confirmations
7. **Mobile App** - React Native for iOS/Android

---

## 7. Conclusion

This Cloud-Native LMS demonstrates practical implementation of:
- Full-stack web development (React + Express)
- Cloud computing principles (AWS deployment)
- Containerization (Docker)
- Scalable database architecture (MongoDB Atlas)
- Security best practices (JWT, RBAC, bcrypt)

The system is production-ready and can be deployed on AWS infrastructure with minimal configuration changes.

---

## References

1. AWS Documentation: https://docs.aws.amazon.com
2. MongoDB Atlas: https://www.mongodb.com/cloud/atlas
3. React Documentation: https://reactjs.org
4. Express.js: https://expressjs.com
5. Docker Docs: https://docs.docker.com

---

**Submitted by:** [Team Members]
**Date:** [Submission Date]
**Course:** CS509 - Enterprise Technology Lab (ETL)