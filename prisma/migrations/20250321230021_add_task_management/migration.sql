/*
  Warnings:

  - You are about to drop the column `tag` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.
  - The `status` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskBoardId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('WELLNESS_SELFCARE', 'SOCIAL_RELATIONSHIPS', 'PRODUCTIVITY_ORGANIZATION');

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "tag",
DROP COLUMN "userId",
ADD COLUMN     "category" "TaskCategory" NOT NULL,
ADD COLUMN     "taskBoardId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
ALTER COLUMN "order" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "TaskBoard" (
    "id" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "weekEndDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskBoard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskBoard_userId_idx" ON "TaskBoard"("userId");

-- CreateIndex
CREATE INDEX "TaskBoard_weekStartDate_weekEndDate_idx" ON "TaskBoard"("weekStartDate", "weekEndDate");

-- CreateIndex
CREATE INDEX "Task_taskBoardId_idx" ON "Task"("taskBoardId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- AddForeignKey
ALTER TABLE "TaskBoard" ADD CONSTRAINT "TaskBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskBoardId_fkey" FOREIGN KEY ("taskBoardId") REFERENCES "TaskBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
