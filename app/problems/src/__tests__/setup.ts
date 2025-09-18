import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { RabbitMQContainer, StartedRabbitMQContainer } from "@testcontainers/rabbitmq";
import { spawn, ChildProcess } from "child_process";
import { execSync } from "child_process";

let dbContainer: StartedPostgreSqlContainer;
let mqContainer: StartedRabbitMQContainer;
let workerProcesses: ChildProcess[] = [];

export default async function globalSetup() {
  // --- 1. Start Postgres ---
  dbContainer = await new PostgreSqlContainer("postgres:15")
    .withDatabase("testdb")
    .withUsername("testuser")
    .withPassword("testpass")
    .start();

  const dbUrl = dbContainer.getConnectionUri();
  process.env.DATABASE_URL = dbUrl;

  // Run migrations
  execSync(`npx prisma migrate deploy`, {
    env: { ...process.env, DATABASE_URL: dbUrl },
    stdio: "inherit",
  });

  // --- 2. Start RabbitMQ ---
  mqContainer = await new RabbitMQContainer("rabbitmq:3-management").start();
  const amqpUrl = mqContainer.getAmqpUrl();
  process.env.RABBITMQ_URL = amqpUrl;

  // --- 3. Start workers ---
  const worker = spawn("npm", ["run", "dev:worker"], {
    env: { ...process.env },
    stdio: "inherit",
    shell: true,
  });
  workerProcesses.push(worker);

  const rabbitWorker = spawn("npm", ["run", "dev:rabbitmq"], {
    env: { ...process.env },
    stdio: "inherit",
    shell: true,
  });
  workerProcesses.push(rabbitWorker);

  // --- 4. Wait for readiness ---
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // --- 5. Save handles for teardown ---
  (global as any).__DB_CONTAINER__ = dbContainer;
  (global as any).__MQ_CONTAINER__ = mqContainer;
  (global as any).__WORKERS__ = workerProcesses;
}
