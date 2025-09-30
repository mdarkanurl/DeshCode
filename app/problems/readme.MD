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
- 🗄 Database – PostgreSQL + Prisma ORM for persistence

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

### Steps  
1. Clone the repository  
   ```bash
   git clone <https://github.com/mdarkanurl/DeshCode.git>
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

## 📌 Roadmap / Future Improvements
- Support multiple languages with sandboxed execution
- Add user profiles and badges
- Implement CI/CD pipeline
- Deploy to cloud (AWS/Azure/GCP)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
If you want to contribute to DeshCode, please follow the guidelines outlined in the [contributing.md](contributing.md) file.

## 📄 License
MIT License