# LeetCode-Style Online Judge

## Description
A LeetCode-style online coding platform implemented with Node.js, TypeScript, and Docker. DeshCode provides a secure environment to submit and execute code, run timed contests, and collaborate through discussions — all built as small, focused microservices.

Key capabilities:
- Secure code execution in isolated Docker sandboxes.
- Timed contests with real-time leaderboards.
- Discussion forums for problem-solving and knowledge sharing.
- Event-driven architecture with RabbitMQ and CDC via Debezium.
- Real-time ranking using Redis and durable persistence in PostgreSQL.

The system leverages event-driven architecture with RabbitMQ, CDC with Debezium, Redis for real-time ranking, and PostgreSQL for persistence.

## Features
- Code Execution – Run user-submitted code inside isolated Docker sandboxes with automated tests and timeouts.
- Contests & Leaderboards – Real-time scoring and leaderboards powered by Debezium + Redis sorted sets.
- Event-Driven Processing – Scalable background processing with RabbitMQ workers.
- Microservices — Clear separation: Auth, Problems, Contests, Leaderboards, Discussions, Workers.
- Security — JWT-based auth, role-based access, sandboxed execution, and input validation.
- Observability — Health endpoints, structured logs, and integration tests with Testcontainers.

## Tech Stack
- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL, Prisma ORM
- Messaging & Streaming: RabbitMQ, Kafka, Debezium
- Caching & Leaderboards: Redis
- Execution: Docker (isolated sandboxes)
- Package Manager: pnpm
- Testing: Jest / Supertest, Testcontainers, Postman

## Architecture & Services
The platform is implemented as independent microservices. Each service has its own README and runs independently.

Core services:
- `auth` — Authentication, user management, OAuth, email verification.
- `problems` — Problem CRUD, submissions API, submission lifecycle orchestration.
- `contests` — Contest lifecycle, participants, contest-specific submissions.
- `leaderboards` — Real-time ranking using Redis, Dezezium, Kafka and event processors.
- `discussions` — Forum-like discussions and comments.
- `workers` — Dedicated workers that pick up jobs (execute code, run tests, compute scores).

Each service exposes a minimal public API surface and health endpoints for orchestration.

## Setup Instructions
You can follow Docs [here](docs) to set up the project locally.
Inside the `docs` folder, you will find various documentation files to help you understand and work with the project.

## Contributing
Contributions, issues, and feature requests are welcome!
If you want to contribute to DeshCode, please follow the guidelines outlined in the [contributing.md](contributing.md) file.

## License
MIT License
