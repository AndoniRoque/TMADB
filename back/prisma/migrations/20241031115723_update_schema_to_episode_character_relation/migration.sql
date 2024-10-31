/*
  Warnings:

  - You are about to drop the column `characterId` on the `Episode` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_characterId_fkey";

-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "characterId";

-- CreateTable
CREATE TABLE "_EpisodeCharacters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EpisodeCharacters_AB_unique" ON "_EpisodeCharacters"("A", "B");

-- CreateIndex
CREATE INDEX "_EpisodeCharacters_B_index" ON "_EpisodeCharacters"("B");

-- AddForeignKey
ALTER TABLE "_EpisodeCharacters" ADD CONSTRAINT "_EpisodeCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EpisodeCharacters" ADD CONSTRAINT "_EpisodeCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
