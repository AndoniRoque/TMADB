import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const createUser = async () => {
  const username = "archivist_andoni";
  const email = "roque.andoni@gmail.com";
  const password = "2016_tmadb_2024";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        mail: email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("Error creating user: ", error);
  } finally {
    await prisma.$disconnect();
  }
};

createUser();
