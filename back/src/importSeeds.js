import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

// Leer el JSON usando URL import.meta.url para obtener la ruta correcta
const seedData = JSON.parse(
  readFileSync(new URL("../prisma/seed-data.json", import.meta.url))
);

async function main() {
  try {
    // Crear los registros en el orden correcto debido a las relaciones
    for (const user of seedData.users) {
      await prisma.user.create({
        data: { ...user },
      });
    }

    for (const episode of seedData.episodes) {
      await prisma.episode.create({
        data: { ...episode },
      });
    }

    for (const character of seedData.characters) {
      await prisma.character.create({
        data: { ...character },
      });
    }

    for (const userEpisode of seedData.userEpisodes) {
      await prisma.userEpisodes.create({
        data: { ...userEpisode },
      });
    }

    for (const episodesOnCharacter of seedData.episodesOnCharacters) {
      await prisma.episodesOnCharacters.create({
        data: { ...episodesOnCharacter },
      });
    }

    console.log("Datos importados correctamente");
  } catch (error) {
    console.error("Error durante la importación:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
