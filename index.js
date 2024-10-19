const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const getAuthor = await prisma.user.findUnique({
    where: {
      id: 1,
    },
    include: {
      posts: true, // All posts where authorId == 20
    },
  });
  console.dir(getAuthor, { depth: null })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })



  // 1 - Manually adjust your Prisma schema data model
  // 2 - Migrate your development database using the prisma migrate dev CLI command
  // 3 - Use Prisma Client in your application code to access your database
