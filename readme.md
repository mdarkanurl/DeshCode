# 🚀 LeetCode-Style Online Judge

## 📖 Description
This project is a LeetCode-style online coding platform built with Node.js, TypeScript, and Docker. It allows users to:

- Submit and execute code securely in Docker containers.
- Compete in timed contests with real-time leaderboards.
- Discuss solutions and share knowledge in a built-in forum.

The system leverages event-driven architecture with RabbitMQ, CDC with Debezium, Redis for real-time ranking, and PostgreSQL for persistence.

## ✨ Features
- 🔹 Code Execution – Runs user code in isolated Docker containers with instant feedback.
- 🔹 Contests & Leaderboards – Real-time scoring using Debezium + Redis sorted sets.
- 🔹 Distributed Processing – Asynchronous job handling with RabbitMQ.
- 🔹 Community Forum – Users can discuss problems and solutions.
- 🔹 Reliable & Tested – Comprehensive test coverage for backend services.

## 🛠 Tech Stack
- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL, Prisma ORM
- Messaging & Streaming: RabbitMQ, Debezium
- Caching & Leaderboards: Redis
- Containerization: Docker
- Testing: Jest / Supertest, Postman

## ⚙️ Setup Instructions
You can follow Docs [here](docs) to set up the project locally.
Inside the `docs` folder, you will find various documentation files to help you understand and work with the project.

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