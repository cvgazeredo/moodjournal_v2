/*
  Warnings:

  - You are about to drop the column `didMindfulness` on the `Mood` table. All the data in the column will be lost.
  - You are about to drop the column `technique` on the `Mood` table. All the data in the column will be lost.
  - You are about to alter the column `hours` on the `Sleep` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[moodId]` on the table `DailyEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sleepId]` on the table `DailyEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[exerciseId]` on the table `DailyEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dietId]` on the table `DailyEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Diet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Mood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sleep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "didExercise" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Mood" DROP COLUMN "didMindfulness",
DROP COLUMN "technique",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Sleep" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "hours" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "DailyEntry_moodId_key" ON "DailyEntry"("moodId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyEntry_sleepId_key" ON "DailyEntry"("sleepId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyEntry_exerciseId_key" ON "DailyEntry"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyEntry_dietId_key" ON "DailyEntry"("dietId");

-- CreateIndex
CREATE INDEX "DailyEntry_date_idx" ON "DailyEntry"("date");
