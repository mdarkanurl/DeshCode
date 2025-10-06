# 💬 Discussions Service

## 📖 Description
The Discussions Service is a microservice in the DevOhh platform that manages community discussions and comments.

It provides:
- Discussion CRUD operations with topic categorization
- Commenting system with pagination
- Role-based access (Admin/User)
- Secure authentication with JWT
- Input validation with Zod
- Full test coverage with Jest & Testcontainers

This service powers the social and collaborative features of the platform.

## ✨ Features
- 📝 Discussions – Create, update, delete, and retrieve discussions
- 💬 Comments – Add and fetch comments with pagination
- 🏷 Topics – Discussions organized into Career, Compensation, Feedback, Interview
- 🔒 Authentication & Roles – JWT authentication, Admin vs. User permissions
- ⚡ Pagination – Efficient pagination for large discussions & comments
- 🛡 Validation – Input validation with Zod schemas
- 🗄 Database – PostgreSQL + Prisma ORM for persistence
- 🧪 Testing – Integration tests with Jest + Testcontainers

## 🛠 Tech Stack
- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL, Prisma ORM
- Auth: JWT (Access & Refresh tokens, HTTP-only cookies)
- Validation: Zod
- Testing: Jest, Supertest, Testcontainers Postman

## ⚙️ Setup Instructions
### Prerequisites  
- Node.js (v18+)  
- Docker  
- PostgreSQL  
- RabbitMQ  
- pnpm package manager
- Docker (for testing with Testcontainers)

**note:-** You can use docker-compose for external services (PostgreSQL, RabbitMQ, Redis).

### Steps  
1. Clone the repository  
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   ```
2. And navigate to `app/discussions`
   ```bash
   cd app/discussions
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

### Discussions
```http
POST   /api/v1/discussions        # Create discussion (Authenticated user)
GET    /api/v1/discussions        # Get all discussions (filters: topic, pagination)
GET    /api/v1/discussions/:id    # Get specific discussion
PUT    /api/v1/discussions/:id    # Update discussion (Owner only)
DELETE /api/v1/discussions/:id    # Delete discussion (Owner only)
```
### Comments
```http
POST   /api/v1/comments/:discussionId   # Create comment (Authenticated user)
GET    /api/v1/comments?discussionId=ID # Get comments with pagination
```
### Health
```http
GET    /api/health   # Service health check
GET    /             # Service info
```

## 🧪 Testing
This service includes comprehensive test coverage with Jest & Testcontainers.

***note:-*** Auth service must be up and running in order to test discussions service.

### Run Test
```bash
   pnpm test
```
### Test Coverage
- ✅ Application tests (health, root, DB)
- ✅ Discussion management (CRUD, validation, auth)
- ✅ Comments (CRUD, pagination, validation)
- ✅ Authentication & authorization (JWT, roles)
- ✅ Error handling (invalid input, permissions)

### Test Flow
1. Start Postgres container
2. Login as user/admin
3. Create test discussions
4. Add comments
5. Validate permissions & responses
6. Cleanup

## 🏗 App Architecture
The Discussions Service follows clean architecture with layered design:
- API Layer – Express routes, middleware (auth, roles)
- Business Layer – Services for discussions & comments
- Data Layer – PostgreSQL + Prisma ORM
- Validation – Zod schemas for request validation
- Security – JWT tokens, HTTP-only cookies, RBAC
- Scalability – Pagination & indexing for large datasets

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
If you want to contribute to DeshCode, please follow the guidelines outlined in the [contributing.md](../../contributing.md) file.

## 📄 License
MIT License