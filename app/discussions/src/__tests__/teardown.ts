export default async function globalTeardown() {

  // Stop DB container
  if ((global as any).__DB_CONTAINER__) {
    await (global as any).__DB_CONTAINER__.stop();
  }

  
  // Close Prisma if loaded
  try {
    const { prisma } = await import("../prisma");
    await prisma.$disconnect();
  } catch {
    // ignore if prisma not imported
  }
}
