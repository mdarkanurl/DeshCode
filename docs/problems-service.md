## Description
The Problems Service is responsible for all the things related to problems, such as creating new problems, updating existing ones, retrieving problem details, and managing test cases. It also contains worker services that handle code execution in a secure environment, ensuring that user-submitted code is run safely and efficiently.

## Features
- Create, read, update, and delete coding problems
- Manage problem tags and difficulty levels
- Store and retrieve problem test cases
- Contains worker services for secure code execution using Docker

## Local setup
1. Clone the repository:
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   cd DeshCode
   ```
2. Go to the `problems` directory:
   ```bash
   cd app/problems
   ```
3. Install dependencies:
   ```bash
   pnpm install --frozen-lockfile
   ```
4. Set up environment variables:
   Create a `.env` file in the `app/problems` directory and add the necessary environment variables. You can use the provided `.env.example` as a reference.

5. Start the Problems Service API:
   ```bash
   npm run dev
   ```
6. Start the Worker Service:
   Open a new terminal, navigate to the `app/problems` directory, and run:
   ```bash
   npm run dev:worker
   ```

**Note:** Ensure that you have Docker, RabbitMQ installed and running on your machine, as the worker service relies on Docker and pulls this => `docker pull thearkan/node.js` for code execution.