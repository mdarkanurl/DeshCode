## Description
The Leaderboards Service is responsible for managing user rankings and scores within the DeshCode platform. It tracks user performance across various coding challenges and contests, providing real-time updates to the leaderboard standings. The service ensures that users can view their rankings and compare their performance with others, fostering a competitive coding environment.

## Features
- Real-time leaderboard updates based on user performance
- Used Debezium to capture real-time data changes in the database and stream them to Kafka topics
- Used Redis to sorting and ranking users efficiently
- stores user scores and rankings in a PostgreSQL database

## Local setup
1. Clone the repository:
   ```bash
   git clone https://github.com/mdarkanurl/DeshCode.git
   cd DeshCode
   ```
2. Go to the `leaderboards` directory:
   ```bash
   cd app/leaderboards
   ```
3. Install dependencies:
   ```bash
   pnpm install --frozen-lockfile
   ```
4. Set up environment variables:
   Create a `.env` file in the `app/leaderboards` directory and add the necessary environment variables. You can use the provided `.env.example` as a reference.

5. Start the Leaderboards Service API:
   ```bash
   npm run dev
   ```
6. Start the Debezium Connector:
   Open a new terminal, navigate to the `app/leaderboards` directory, and run:
   **Note:** Make sure you follow [Debizium-setup.md](Debizium-setup.md) file which is in the docs folder before running the worker service.
   ```bash
   npm run dev:debezium
   ```

**Note:** Ensure that you have necessary tools installed and running on your machine, follow the docker-compose-external-services.yml file in the .Docker directory to set up the required services like PostgreSQL, Redis, Kafka, and RabbitMQ.