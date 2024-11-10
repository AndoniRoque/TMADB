/*
  Warnings:

  - You are about to drop the `_EpisodesOnCharacters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EpisodesOnCharacters" DROP CONSTRAINT "_EpisodesOnCharacters_A_fkey";

-- DropForeignKey
ALTER TABLE "_EpisodesOnCharacters" DROP CONSTRAINT "_EpisodesOnCharacters_B_fkey";

-- DropTable
DROP TABLE "_EpisodesOnCharacters";

-- CreateTable
CREATE TABLE "EpisodesOnCharacters" (
    "episodeId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "EpisodesOnCharacters_pkey" PRIMARY KEY ("episodeId","characterId")
);

-- AddForeignKey
ALTER TABLE "EpisodesOnCharacters" ADD CONSTRAINT "EpisodesOnCharacters_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodesOnCharacters" ADD CONSTRAINT "EpisodesOnCharacters_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
