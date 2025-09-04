## Description
The Contests Service is responsible for managing contests within the DeshCode platform. It handles the creation, updating, and retrieval of contests, as well as managing contest participants and their submissions. The service ensures that contests are conducted fairly and efficiently, providing users with a competitive coding environment.

## Features
- Create, read, update, and delete contests
- Manage contest participants and their submissions
- Run users' code submissions against predefined test cases in a secure environment
- Store submission results with scoring and provide feedback to users

## Local setup
1. Clone the repository:
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   cd DeshCode
   ```
2. Go to the `contests` directory:
   ```bash
   cd app/contests
   ```
3. Install dependencies:
   ```bash
   pnpm install --frozen-lockfile
   ```
4. Set up environment variables:
   Create a `.env` file in the `app/contests` directory and add the necessary environment variables. You can use the provided `.env.example` as a reference.

5. Start the Contests Service API:
   ```bash
   npm run dev
   ```
6. Start the Worker Service:
   Open a new terminal, navigate to the `app/contests` directory, and run:
   ```bash
   npm run dev:worker
   ```

**Note:** Ensure that you have Docker, RabbitMQ installed and running on your machine, as the worker service relies on Docker and pulls this => `docker pull thearkan/node.js` for code execution.