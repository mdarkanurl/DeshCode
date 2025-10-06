# 🚀 Problems Service

## 📖 Description
The Problems Service is a microservice in our coding platform responsible for managing programming problems and handling user submissions.

It provides:
- Admin features to create, update, and delete coding problems
- User features to browse problems with filters and pagination
- Secure code execution in Docker containers with automated testing
- Asynchronous job handling with RabbitMQ workers

This service powers the problem-solving core of the platform.

## ✨ Features
- 📝 Problem Management – Create, update, delete, and retrieve problems
- 🔍 Filtering & Search – Difficulty, tags, categories, and pagination
- ⚡ Code Submissions – Users can submit solutions for automated testing
- 🐇 Asynchronous Execution – RabbitMQ workers for scalable processing
- 🔒 Authentication & Roles – Admin vs. user permissions via JWT
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
2. And navigate to `app/problems`
   ```bash
   cd app/problems
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

### Problems Management  
```http
POST   /api/v1/problems       # Create problem (Admin only)
GET    /api/v1/problems       # Get all problems (filters: difficulty, category, tags, pagination)
GET    /api/v1/problems/:id   # Get specific problem
PUT    /api/v1/problems/:id   # Update problem (Admin only)
DELETE /api/v1/problems/:id   # Delete problem (Admin only)
```
### Submissions
```http
POST   /api/v1/submissions      # Submit solution (Authenticated users)
GET    /api/v1/submissions/:id  # Get submission status
```
### Health
```http
GET    /api/health   # Service health check
GET    /             # Service info
```

## 🧪 Testing
This service has full integration tests using Jest, Supertest, and Testcontainers.

***note:-*** Auth service must be up and running in order to test Problems service.

### Run Test
```bash
   pnpm test
```
### Test Coverage
- ✅ Application tests (health, root, DB)
- ✅ Problem management (CRUD, filters, validation, auth)
- ✅ Submissions (workflow, status tracking, error handling)
- ✅ Worker system (RabbitMQ + Docker execution)
- ✅ Error scenarios (invalid inputs, unsupported languages)

### Test Flow
1. Start containers (Postgres, RabbitMQ, workers)
2. Login as admin/user
3. Create test problems
4. Submit solutions
5. Verify status/results
6. Cleanup

## 🏗 App Architecture
The Problems Service follows a microservice architecture with clear separation of concerns:
- API Layer – Express routes with authentication & authorization middleware
- Business Layer – Services handle problem management & submissions
- Data Layer – PostgreSQL + Prisma ORM for persistence
- Messaging Layer – RabbitMQ for asynchronous job processing
- Worker System – Dedicated workers execute user code inside Docker containers
- Security – JWT authentication, role-based access, resource isolation for execution
- Scalability – Queue-based execution allows horizontal scaling of workers

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
If you want to contribute to DeshCode, please follow the guidelines outlined in the [contributing.md](../../contributing.md) file.

## 📄 License
MIT License