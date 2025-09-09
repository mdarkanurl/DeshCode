# Auth Service
This directory contains the authentication service for the application. It handles user registration, login, change password, forgot password, and token management. It also handles Admin management.

## Features
- User Registration and Login
- User Email Verification
- Change Password
- Forgot Password
- Token Management (Access and Refresh Tokens)
- Admin Management
- Role-Based Access Control
- Secure Password Hashing with bcrypt
- Input Validation with zod
- Comprehensive Testing with Jest and Supertest with Testcontainers
- OOP Design Principles
- Dockerized for easy deployment

## Tech Stack
- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- RabbitMQ
- bcrypt
- zod
- JWT
- Docker
- Jest
- Supertest
- Testcontainers

## Setup Instructions
    1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2. Navigate to the project directory:
   ```bash
   cd auth
   ```
3. Install the dependencies:
   ```bash
   pnpm install --frozen-lockfile
   ```
4. Set up the environment variables:
   ```bash
   cp .env.example .env
   ```
5. Run the application:
   ```bash
   npm run dev
   ```   npm run dev
6. Run the tests:
   ```bash
   npm run test
    ```