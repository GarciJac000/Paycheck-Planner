import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      passwordHash: await bcrypt.hash("demo123", 10),
      name: "Demo User",
    },
  });

  // Create demo bills
  await prisma.bill.deleteMany({ where: { userId: user.id } });
  const bills = await Promise.all([
    prisma.bill.create({
      data: {
        userId: user.id,
        name: "Rent",
        amount: 1200,
        dueDate: 1,
        isFixed: true,
        isRecurring: true,
      },
    }),
    prisma.bill.create({
      data: {
        userId: user.id,
        name: "Utilities",
        amount: 120,
        dueDate: 15,
        isFixed: true,
        isRecurring: true,
      },
    }),
    prisma.bill.create({
      data: {
        userId: user.id,
        name: "Internet",
        amount: 60,
        dueDate: 10,
        isFixed: true,
        isRecurring: true,
      },
    }),
    prisma.bill.create({
      data: {
        userId: user.id,
        name: "Groceries",
        amount: 300,
        dueDate: 20,
        isFixed: false,
        isRecurring: true,
      },
    }),
  ]);

  console.log(`✅ Seeded ${bills.length} bills for ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
