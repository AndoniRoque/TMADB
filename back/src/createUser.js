import { PrismaClient } from "@prisma/client";

import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const createUser = async () => {
  const username = "archivist";
  const email = "jsims@tmi.com";
  const password = "jsims";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const findUser = await prisma.user.findFirst({
      where: {
        username: { equals: username }
      },
    })

    const newUser = await prisma.user.create({
      data: {
        username: username,
        mail: email,
        password: hashedPassword
      },
    });
    console.log('User created successfully:', newUser);
  } catch (error) {
    console.error("Error creating user: ", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();