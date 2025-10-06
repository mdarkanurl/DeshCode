# 🔐 Auth Service

## 📖 Description
The Auth Service is a microservice in our coding platform responsible for user authentication and authorization. It provides secure user management with multiple authentication methods and role-based access control.

It provides:
- User registration and email verification
- Local authentication with email/password
- OAuth integration with Google and GitHub
- Password management (reset, change)
- JWT-based session management with refresh tokens
- Role-based authorization (Admin/User)
- Asynchronous email notifications via RabbitMQ

This service powers the authentication core of the platform, ensuring secure access to all other services.

## ✨ Features
- 🔐 User Authentication – Local login with email verification
- 🌐 OAuth Integration – Google and GitHub social login
- 📧 Email Verification – Automated verification codes via Resend
- 🔑 Password Management – Reset, change, and secure storage
- 🎫 JWT Tokens – Access and refresh token management
- 👥 Role-Based Access – Admin and User role permissions
- 🐇 Asynchronous Email – RabbitMQ workers for email delivery
- 🗄 Database – PostgreSQL + Prisma ORM for persistence
- 🍪 Secure Cookies – HttpOnly, secure cookie-based sessions

## 🛠 Tech Stack
- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL, Prisma ORM
- Authentication: JWT, Passport.js, bcryptjs
- OAuth: Google OAuth 2.0, GitHub OAuth
- Messaging: RabbitMQ, amqplib
- Email: Resend API
- Validation: Zod schemas
- Testing: Jest, Supertest, Testcontainers

## ⚙️ Setup Instructions
### Prerequisites  
- Node.js (v18+)  
- PostgreSQL  
- RabbitMQ  
- pnpm package manager  
- Google OAuth credentials
- GitHub OAuth credentials
- Resend API key

**note:-** You can use docker-compose for external services (PostgreSQL, RabbitMQ, Redis).

### Steps  
1. Clone the repository  
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   ```
2. Navigate to `app/auth`
   ```bash
   cd app/auth
   ```
3. Install dependencies
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

6. Seed the database (optional)
   ```bash
   pnpm prisma-seed
   ```

7. Run the app
   ```bash
   pnpm dev   # development
   pnpm build && pnpm start  # production
   ```

## 📌 API Endpoints  

### Authentication
```http
POST   /api/v1/auth/signup           # User registration
POST   /api/v1/auth/resend-code      # Resend verification code
POST   /api/v1/auth/verify-email     # Verify email with code
POST   /api/v1/auth/login            # User login
GET    /api/v1/auth/logout           # User logout
POST   /api/v1/auth/forget-password  # Request password reset
PUT    /api/v1/auth/new-password     # Set new password with code
PUT    /api/v1/auth/changes-password # Change password (authenticated)
```

### OAuth
```http
GET    /api/v1/oauth/google          # Google OAuth login
GET    /api/v1/oauth/google/callback # Google OAuth callback
GET    /api/v1/oauth/github          # GitHub OAuth login
GET    /api/v1/oauth/github/callback # GitHub OAuth callback
```

### Health
```http
GET    /api/health   # Service health check
GET    /             # Service info
```

## 🧪 Testing
This service has comprehensive integration tests using Jest, Supertest, and Testcontainers.

### Run Tests
```bash
   pnpm test
```

### Test Coverage
- ✅ Application tests (health, root, DB)
- ✅ User registration (signup, validation, email verification)
- ✅ Authentication (login, logout, JWT tokens)
- ✅ Password management (reset, change, validation)
- ✅ OAuth integration (Google, GitHub)
- ✅ Middleware testing (authentication, authorization)
- ✅ Error scenarios (invalid inputs, expired tokens)

### Test Flow
1. Start containers (Postgres, RabbitMQ)
2. Test user registration and email verification
3. Test login/logout functionality
4. Test password reset flow
5. Test OAuth providers
6. Test middleware and error handling
7. Cleanup

## 🏗 App Architecture
The Auth Service follows a microservice architecture with clear separation of concerns:

- **API Layer** – Express routes with authentication & authorization middleware
- **Business Layer** – Services handle user management, authentication, and OAuth
- **Data Layer** – PostgreSQL + Prisma ORM for user and auth provider persistence
- **Messaging Layer** – RabbitMQ for asynchronous email processing
- **Security Layer** – JWT tokens, bcrypt password hashing, secure cookies
- **OAuth Layer** – Passport.js strategies for Google and GitHub integration
- **Validation Layer** – Zod schemas for request validation
- **Email Layer** – Resend API integration for verification and password reset emails

### Key Components
- **User Model** – Core user information with roles and verification status
- **AuthProvider Model** – Multiple authentication providers per user
- **JWT Management** – Access tokens (5min) and refresh tokens with automatic renewal
- **Middleware** – Authentication, temporary token validation, and role-based access
- **OAuth Strategies** – Seamless Google and GitHub integration with profile sync

## 🔒 Security Features
- **Password Security** – bcrypt hashing with salt rounds
- **JWT Security** – Short-lived access tokens with refresh token rotation
- **Cookie Security** – HttpOnly, secure, sameSite cookies
- **Email Verification** – Required for account activation
- **Admin Protection** – Restricted admin account creation
- **Input Validation** – Comprehensive Zod schema validation
- **Error Handling** – Secure error messages without sensitive data exposure

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
If you want to contribute to DeshCode, please follow the guidelines outlined in the [contributing.md](../../contributing.md) file.

## 📄 License
MIT License