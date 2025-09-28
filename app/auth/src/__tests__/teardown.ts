export default async function globalTeardown() {

  // This time out gives time worker to finish task 
  await new Promise((resolve) => setTimeout(resolve, 30_000));

  // Stop DB container
  if ((global as any).__DB_CONTAINER__) {
    await (global as any).__DB_CONTAINER__.stop();
  }

  // Stop RabbitMQ container
  if ((global as any).__MQ_CONTAINER__) {
    await (global as any).__MQ_CONTAINER__.stop();
  }

  // Close Prisma if loaded
  try {
    const { prisma } = await import("../prisma");
    await prisma.$disconnect();
  } catch {
    // ignore if prisma not imported
  }
}
