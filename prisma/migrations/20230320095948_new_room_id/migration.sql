/*
  Warnings:

  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `ConnectedRooms` DROP FOREIGN KEY `ConnectedRooms_roomId_fkey`;

-- AlterTable
ALTER TABLE `ConnectedRooms` MODIFY `roomId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Room` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `ConnectedRooms` ADD CONSTRAINT `ConnectedRooms_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
