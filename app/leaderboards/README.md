# 🏆 Leaderboards Service

## 📖 Description
The Leaderboards Service is a microservice in the DeshCode platform responsible for managing real-time contest leaderboards.

It provides:
- Live leaderboard updates from user submissions
- High-performance caching using Redis
- Real-time event-driven updates via Kafka & Debezium
- Secure access with JWT authentication and role-based permissions

This service powers the ranking system and ensures contest results are always up to date.

## ✨ Features
- ⚡ Real-time Leaderboards – Kafka + Debezium for live updates
- 🗃 Redis Caching – Fast leaderboard storage and retrieval
- 📑 Pagination Support – Efficient queries for large leaderboards
- 🔒 Authentication & Roles – JWT tokens with admin/user roles
- 🔒 Authentication & Roles – Admin vs. user permissions via JWT
- 🛡 Error Handling – Custom error classes and structured responses

## 🛠 Tech Stack
- Backend: Node.js, TypeScript, Express
- Cache: Redis (sorted sets for ranking)
- Messaging : Kafka + Debezium (CDC from PostgreSQL)
- Auth: JWT (Access & Refresh tokens, role-based access)
- Testing: Jest, Supertest, Testcontainers, Postman

## ⚙️ Setup Instructions
### Prerequisites  
- Node.js (v18+)  
- Redis  
- PostgreSQL + Debezium
- Kafka
- pnpm package manager  

### Steps  
1. Clone the repository  
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   ```
2. And navigate to `.Docker`
   ```bash
   cd .Docker
   ```
3. Run docker-compose-leaderboards.yml to start leaderboard service
   ```bash
   docker-compose -f docker-compose-leaderboards.yml up -d
   ```

## 📌 API Endpoints  

### leaderboard  
```http
GET    /api/v1/leaderboards/:contestId      # Get all rankings for a contest (pagination: page, limit)
```
### Health
```http
GET    /api/health   # Service health check
GET    /             # Service info
```

## 🧪 Testing
This service has full integration tests using Jest, Supertest, and Testcontainers.

***note:-*** Contests service must be up and running in order to test Leaderboards service.

### Run Test
```bash
   pnpm test
```
### Test Coverage
- ✅ Leaderboard retrieval (pagination, formatting)
- ✅ Real-time Kafka & Debezium event processing
- ✅ Redis ranking operations
- ✅ Authentication & role-based access
- ✅ Error handling & edge cases

### Test Flow
1. Start containers
3. Create test leaderboards
4. Submit solutions
5. Verify status/results
6. Cleanup

## 🏗 App Architecture
- The Leaderboards Service follows a clean microservice architecture:
- API Layer – Express routes with JWT auth & role-based middleware
- Business Layer – Services handle leaderboard logic & formatting
- Cache Layer – Redis sorted sets for ranking and pagination
- Event Layer – Kafka consumer with Debezium for real-time updates
- Security – JWT tokens, role-based access, HTTP-only cookies
- Scalability – Event-driven processing with Kafka consumer groups

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
If you want to contribute to DeshCode, please follow the guidelines outlined in the [contributing.md](../../contributing.md) file.

## 📄 License
MIT License