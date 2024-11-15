-- DropForeignKey
ALTER TABLE "EpisodesOnCharacters" DROP CONSTRAINT "EpisodesOnCharacters_characterId_fkey";

-- DropForeignKey
ALTER TABLE "EpisodesOnCharacters" DROP CONSTRAINT "EpisodesOnCharacters_episodeId_fkey";

-- AddForeignKey
ALTER TABLE "EpisodesOnCharacters" ADD CONSTRAINT "EpisodesOnCharacters_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodesOnCharacters" ADD CONSTRAINT "EpisodesOnCharacters_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
