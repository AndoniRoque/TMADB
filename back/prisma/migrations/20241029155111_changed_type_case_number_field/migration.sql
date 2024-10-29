/*
  Warnings:

  - You are about to alter the column `caseNumber` on the `Episode` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Episode" ALTER COLUMN "caseNumber" SET DATA TYPE INTEGER;
