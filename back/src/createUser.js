import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createUser = async () => {
  const username = "andoni";
  const email = "roque.andoni@gmail.com";
  const password = "123456";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        mail: email,
        password: hashedPassword,
        role: "USER",
      },
    });
  } catch (error) {
    console.error("Error creating user: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

createUser();
