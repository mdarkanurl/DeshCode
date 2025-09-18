import { prisma } from "../prisma";

async function main() {
    // Seed a Admin on Database for testing
    const admin = await prisma.user.create({
        data: {
          email: 'admin@Deshcode.com',
          role: "ADMIN"
        },
    });

    await prisma.authProvider.create({
        data: {
            provider: "local",
            email: admin.email,
            password: "testingPassword",
            userId: admin.id
        }
    });

    // Seed a User on Database for testing
    const user = await prisma.user.create({
        data: {
          email: 'user@DeshCode.com',
        },
    });

    await prisma.authProvider.create({
        data: {
            provider: "local",
            email: user.email,
            password: "testingPassword",
            userId: user.id
        }
    });
}

// Call the function
main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
