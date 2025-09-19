import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "child_process";

let dbContainer: StartedPostgreSqlContainer;

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

  // --- 4. Wait for readiness ---
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // --- 5. Save handles for teardown ---
  (global as any).__DB_CONTAINER__ = dbContainer;
}
