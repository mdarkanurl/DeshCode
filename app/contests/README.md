# 🚀 Contests Service

## 📖 Description
The Contests Service is a microservice in our coding platform responsible for managing programming contests, participants, and code submissions.

It provides:
- Admin features to create and manage contests
- User features to join contests and submit solutions
- Real-time code execution in Docker containers with automated scoring
- Asynchronous job handling with RabbitMQ workers

This service powers the contest & competition system of the platform.

## ✨ Features
- 🏆 Contest Management – Create, view, and manage contests
- 👥 Participant Registration – Users can join contests and track participation
- ⚡ Code Submissions – Real-time execution and scoring of user solutions
- 🐇 Asynchronous Processing – RabbitMQ workers for scalable submission handling
- 🔒 Authentication & Roles – JWT-based authentication with role-based access
- 🗄 Database – PostgreSQL + Prisma ORM for persistence
- 🐳 Docker Execution – Isolated sandbox environment for secure code execution

## 🛠 Tech Stack
- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL, Prisma ORM
- Messaging : RabbitMQ
- Execution: Docker (secure sandbox)
- Testing: Jest, Supertest, Testcontainers Postman

## ⚙️ Setup Instructions
### Prerequisites  
- Node.js (v18+)  
- Docker  
- PostgreSQL  
- RabbitMQ  
- pnpm package manager

**note:-** You can use docker-compose for external services (PostgreSQL, RabbitMQ, Redis).

### Steps  
1. Clone the repository  
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   ```
2. And navigate to `app/contests`
   ```bash
   cd app/contests
   ```
3. Install necessary dependency
    ```bash
   pnpm install --frozen-lockfile
   ```
4. Add environment variable
   create a `.env` file and add the variable. Use `.env.example` for guidance.

5. Setup database
   ```bash
   pnpm prisma:generate
   npx prisma migrate deploy
   ```
6. Run the app
   ```bash
   pnpm dev   # development
   pnpm build && pnpm start  # production
   ```

## 📌 API Endpoints  

### Contests  
```http
POST   /api/v1/contests         # Create contest (Admin only)
GET    /api/v1/contests         # Get all contests (with pagination)
GET    /api/v1/contests/:id     # Get contest by ID
```
### Participants
```http
POST   /api/v1/participants/:contestId     # Join contest (Authenticated)
GET    /api/v1/participants/:contestId     # Get contest participants (Admin)
GET    /api/v1/participants/users/:userId  # Get contests joined by a user (Admin)
```
### Submissions
```http
POST   /api/v1/submissions/:contestId  # Submit solution (Authenticated)
GET    /api/v1/submissions/:id         # Get submission details (Authenticated)
```
### Health
```http
GET    /api/health   # Service health check
GET    /             # Service info
```

## 🧪 Testing
The Contests Service includes unit and integration tests with Jest, Supertest, and Testcontainers.

***note:-*** Auth service must be up and running in order to test contests service.

### Run Test
```bash
   pnpm test
```
### Test Coverage
- ✅ Contest management (CRUD, validation, permissions)
- ✅ Participant registration (join, view, list)
- ✅ Submissions (workflow, execution, scoring)
- ✅ Worker system (RabbitMQ + Docker execution)
- ✅ Error scenarios (invalid input, timeouts, runtime errors)

### Test Flow
1. Start containers (Postgres, RabbitMQ, workers)
2. Login as admin/user
3. Create contests & join participants
4. Submit solutions
5. Verify scoring & results
6. Cleanup

## 🏗 App Architecture
The Contests Service follows a clean microservice architecture:

- API Layer – Express routes with authentication & authorization middleware
- Business Layer – Services handle contests, participants, and submissions
- Data Layer – PostgreSQL + Prisma ORM for persistence
- Messaging Layer – RabbitMQ for asynchronous submission processing
- Worker System – Dedicated workers execute user code in Docker containers
- Security – JWT authentication, role-based access, isolated execution environment
- Scalability – Queue-based execution allows horizontal scaling of workers

## 📊 Scoring System
- EASY: +1 / -1
- MEDIUM: +2 / -2
- HARD: +3 / -3
- Fatal errors: 0 points

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
If you want to contribute to DeshCode, please follow the guidelines outlined in the [contributing.md](../../contributing.md) file.

## 📄 License
MIT License