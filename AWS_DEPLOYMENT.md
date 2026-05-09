# LMS Pro Max - AWS Deployment Guide

## Option 1: AWS EC2 with Docker

### Prerequisites
- AWS Account
- EC2 Instance (t2.medium or larger)
- Docker & Docker Compose installed on EC2

### Steps

1. **SSH into your EC2 instance**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

2. **Clone and setup**
```bash
git clone <your-repo-url>
cd lms-project
cp .env.example .env
# Edit .env with production values
```

3. **Deploy with Docker Compose**
```bash
docker-compose -f docker-compose.yml up -d
```

4. **Configure Security Groups**
- Port 80 (HTTP)
- Port 443 (HTTPS) - add SSL later
- Port 5173 (for direct frontend access if needed)

---

## Option 2: MongoDB Atlas + AWS Beanstalk

### MongoDB Atlas Setup

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP `0.0.0.0/0` for development
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/lms_db`

### Backend Deployment (Elastic Beanstalk)

1. Install EB CLI: `pip install awsebcli`
2. Initialize: `eb init`
3. Create environment: `eb create lms-prod`
4. Set environment variables:
```bash
eb setenv NODE_ENV=production MONGO_URI="your-mongodb-atlas-uri" JWT_SECRET="secure-secret" CLIENT_URL="your-frontend-url"
```

### Frontend Deployment (S3 + CloudFront)

1. Build: `cd client && npm run build`
2. Upload dist/ to S3 bucket
3. Configure CloudFront distribution
4. Update `vite.config.js` with production API URL

---

## Option 3: AWS Amplify (Frontend) + ECS (Backend)

### Frontend
1. Connect repo to AWS Amplify
2. Build settings:
```yaml
version: 1
frontend:
  phases:
    build:
      commands:
        - cd client
        - npm install
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
```

### Backend (ECS)
1. Create ECS cluster
2. Create task definition
3. Deploy using docker-compose.yml

---

## Environment Variables for Production

| Variable | Description | Required |
|----------|-------------|----------|
| MONGO_URI | MongoDB Atlas connection string | Yes |
| JWT_SECRET | 64+ character random string | Yes |
| CLIENT_URL | Production frontend URL | Yes |
| NODE_ENV | Set to "production" | Yes |

## SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Health Check

- Backend: `GET /api/health` returns `{"status": "ok"}`
- Frontend: Root URL returns 200 OK

## Troubleshooting

### Backend won't start
- Check MongoDB connection: `docker logs lms_backend`
- Verify environment variables: `docker exec lms_backend env`

### Frontend shows 502
- Backend not responding: `docker logs lms_backend`
- Check port mapping: Ensure backend is on port 5000

### Database connection refused
- MongoDB container running: `docker ps`
- Check connection string format
