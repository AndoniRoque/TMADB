/*
  Warnings:

  - You are about to drop the column `episodeId` on the `Character` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_episodeId_fkey";

-- AlterTable
ALTER TABLE "Character" DROP COLUMN "episodeId";

-- CreateTable
CREATE TABLE "_EpisodesOnCharacters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EpisodesOnCharacters_AB_unique" ON "_EpisodesOnCharacters"("A", "B");

-- CreateIndex
CREATE INDEX "_EpisodesOnCharacters_B_index" ON "_EpisodesOnCharacters"("B");

-- AddForeignKey
ALTER TABLE "_EpisodesOnCharacters" ADD CONSTRAINT "_EpisodesOnCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EpisodesOnCharacters" ADD CONSTRAINT "_EpisodesOnCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
