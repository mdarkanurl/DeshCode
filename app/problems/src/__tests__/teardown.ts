// tests/teardown.ts
export default async function globalTeardown() {
  const container = (global as any).__DB_CONTAINER__;
  if (container) {
    await container.stop();
  }
}
