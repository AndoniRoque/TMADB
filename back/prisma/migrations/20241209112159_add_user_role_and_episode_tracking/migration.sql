/*
  Warnings:

  - You are about to drop the column `heard` on the `Episode` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "heard";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "UserEpisodes" (
    "userId" INTEGER NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "heard" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserEpisodes_pkey" PRIMARY KEY ("userId","episodeId")
);

-- AddForeignKey
ALTER TABLE "UserEpisodes" ADD CONSTRAINT "UserEpisodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEpisodes" ADD CONSTRAINT "UserEpisodes_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
