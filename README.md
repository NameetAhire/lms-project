# Cloud-Native Learning Management System (LMS)

## Features

### User Roles
- **Admin**: Manage users, instructors, and platform-wide courses
- **Instructor**: Create and manage courses with lessons
- **Student**: Browse, enroll, and track learning progress

### Core Features
- JWT-based authentication with role-based access control (RBAC)
- Course creation and management with lessons
- Student enrollment and progress tracking
- Dashboard analytics for each role
- INR (₹) pricing for Indian market
- Responsive, immersive UI design

---

## Quick Start

### 1. Install Dependencies
```bash
# From project root
npm install

# Or install separately
cd server && npm install
cd ../client && npm install
```

### 2. Environment Setup
```bash
# Copy environment file
cp .env .env

# Edit .env with your MongoDB connection string
# Make sure JWT_SECRET is set to a long random string
```

### 3. Seed Demo Data
```bash
cd server
node seed/seed.js
```

### 4. Start Development
```bash
npm run dev
```

### 5. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | admin123 |
| Instructor | instructor@lms.com | instructor123 |
| Student | student@lms.com | student123 |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite 5 + Tailwind CSS 3 |
| **Backend** | Express.js + Node.js 20 |
| **Database** | MongoDB + Mongoose ODM |
| **Auth** | JWT + bcryptjs |
| **Styling** | Tailwind CSS + Lucide Icons |
| **Containerization** | Docker + Docker Compose |
| **Cloud** | AWS EC2 / ECS / S3 / CloudFront / MongoDB Atlas |

---

## Project Structure

```
lms-project/
├── .env                 # Environment variables
├── .env.example         # Environment template
├── .gitignore
├── docker-compose.yml   # Docker deployment
├── package.json         # Root package (concurrently)
├── README.md
├── AWS_DEPLOYMENT.md    # Cloud deployment guide
├── PROJECT_REPORT.md    # ETL project report
├── PRESENTATION.md      # Project presentation
│
├── server/              # Express.js Backend
│   ├── index.js         # Entry point
│   ├── package.json
│   ├── .env             # Server environment
│   ├── Dockerfile       # Docker container
│   ├── .dockerignore
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lesson.js
│   │   ├── Enrollment.js
│   │   └── Progress.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── lessons.js
│   │   ├── enrollments.js
│   │   ├── progress.js
│   │   └── dashboard.js
│   ├── middleware/
│   │   └── auth.js
│   └── seed/
│       └── seed.js      # Demo data seeder
│
└── client/              # React Frontend
    ├── package.json
    ├── vite.config.js   # Vite + API proxy
    ├── tailwind.config.js
    ├── index.html
    ├── Dockerfile       # Multi-stage build
    ├── nginx.conf       # Nginx config for production
    ├── .dockerignore
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── lib/
        │   └── api.js   # Axios API client
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   └── Layout.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Courses.jsx
            ├── CourseDetail.jsx
            ├── LessonView.jsx
            ├── Dashboard.jsx
            ├── AdminUsers.jsx
            ├── AdminCourses.jsx
            ├── Profile.jsx
            └── AddCourse.jsx
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id/role` | Update role |
| DELETE | `/api/users/:id` | Delete user |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List courses |
| GET | `/api/courses/:id` | Get course details |
| POST | `/api/courses` | Create course |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/enrollments` | Enroll in course |
| GET | `/api/enrollments/my` | My enrollments |
| PUT | `/api/enrollments/:id/progress` | Update progress |

---

## Cloud Deployment

### Option 1: AWS EC2 + Docker (Recommended)
```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Clone and deploy
git clone <your-repo>
cd lms-project
cp .env.example .env
# Edit .env with MongoDB Atlas URI

docker-compose up -d
```

### Option 2: AWS Amplify + ECS
- Frontend: AWS Amplify (auto-deploy from Git)
- Backend: ECS Fargate
- Database: MongoDB Atlas (M10 cluster)

### MongoDB Atlas Setup
1. Create free cluster at mongodb.com/cloud/atlas
2. Create database user
3. Whitelist IP `0.0.0.0/0` for development
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/lms_db`

---


## License

This project is for educational purposes as part of CS509 - Enterprise Technology Lab.

---

## References

- [React Documentation](https://reactjs.org)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [AWS Documentation](https://docs.aws.amazon.com)
- [Docker Docs](https://docs.docker.com)
