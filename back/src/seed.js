import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { writeFileSync } from "fs";

async function exportData() {
  const users = await prisma.user.findMany();
  const episodes = await prisma.episode.findMany();
  const characters = await prisma.character.findMany();
  const userEpisodes = await prisma.userEpisodes.findMany();
  const episodesOnCharacters = await prisma.episodesOnCharacters.findMany();

  const seedData = {
    users,
    episodes,
    characters,
    userEpisodes,
    episodesOnCharacters,
  };

  writeFileSync("../prisma/seed-data.json", JSON.stringify(seedData, null, 2));
}

async function main() {
  try {
    await exportData();
    console.log("Datos exportados correctamente");
  } catch (err) {
    console.error("Error exportando datos:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
