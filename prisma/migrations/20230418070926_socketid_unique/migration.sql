/*
  Warnings:

  - The primary key for the `ConnectedRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ConnectedRooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[socketId]` on the table `ConnectedRooms` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `ConnectedRooms` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `guestId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ConnectedRooms_socketId_key` ON `ConnectedRooms`(`socketId`);
