import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';

let container: StartedPostgreSqlContainer;

export default async function globalSetup() {
  container = await new PostgreSqlContainer('postgres:15')
    .withDatabase('testdb')
    .withUsername('testuser')
    .withPassword('testpass')
    .start();

  const url = container.getConnectionUri(); 
  process.env.DATABASE_URL = url;

  // Run migrations so schema matches
  execSync(`npx prisma migrate deploy`, {
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'inherit',
  });

  // Save connection info for teardown
  (global as any).__DB_CONTAINER__ = container;
}
