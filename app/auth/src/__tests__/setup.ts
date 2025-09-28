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

  // Give RabbitMQ a bit more time to become fully ready
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const rabbitWorker = spawn("npx", ["ts-node", "./src/RabbitMQ.ts"], {
    env: { ...process.env },
    stdio: "inherit",
    shell: true,
  });
  rabbitWorker.on("error", (err) => {
    console.error("Rabbit worker process error:", err);
  });
  workerProcesses.push(rabbitWorker);

  // --- 4. Save handles for teardown ---
  (global as any).__DB_CONTAINER__ = dbContainer;
  (global as any).__MQ_CONTAINER__ = mqContainer;
  (global as any).__WORKERS__ = workerProcesses;
}
