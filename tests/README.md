# 🧪 DeshCode Testing Infrastructure
This document explains how testing is organized across all services in the DeshCode microservices architecture, how Testcontainers are used for ephemeral databases and message queues, and how tests integrate with workers and Prisma migrations.

🐳 What Testcontainers Does
Testcontainers is a Node.js library (originally from Java) that allows you to:

1. Spin up Docker containers programmatically for testing.
2. Provide isolated, ephemeral environments for databases, message brokers, or other services.
3. Automatically clean up containers after tests finish.
4. Integrate seamlessly with Jest, Mocha, or other test frameworks.

✅ Why Testcontainers is Useful
- Reliable integration tests: You test against real services (Postgres, RabbitMQ) instead of mocks.
- Consistency: Every test run starts from a clean slate.
- CI/CD friendly: Works in Docker-enabled CI environments (GitHub Actions, GitLab, etc.).
- Isolation: No need to install local Postgres or RabbitMQ, no conflicts with dev databases.

You can visit each service's __tests__ directory for information on how tests are structured and run.