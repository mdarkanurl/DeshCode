import { prisma } from "../prisma";
import bcrypt from "bcryptjs";

async function main() {
    // Seed a Admin on Database for testing
    const admin = await prisma.user.create({
        data: {
          email: 'admin@DeshCode.com',
          role: "ADMIN",
          isVerified: true
        },
    });

    // Hash the password
    const hashPass = await bcrypt.hash("testingPassword", 10);

    await prisma.authProvider.create({
        data: {
            provider: "local",
            email: admin.email,
            password: hashPass,
            userId: admin.id
        }
    });

    // Seed a User on Database for testing
    const user = await prisma.user.create({
        data: {
          email: 'user@DeshCode.com',
          isVerified: true
        },
    });

    await prisma.authProvider.create({
        data: {
            provider: "local",
            email: user.email,
            password: hashPass,
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
