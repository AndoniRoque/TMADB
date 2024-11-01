/*
  Warnings:

  - You are about to drop the `_EpisodeCharacters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EpisodeCharacters" DROP CONSTRAINT "_EpisodeCharacters_A_fkey";

-- DropForeignKey
ALTER TABLE "_EpisodeCharacters" DROP CONSTRAINT "_EpisodeCharacters_B_fkey";

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "episodeId" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "_EpisodeCharacters";

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
