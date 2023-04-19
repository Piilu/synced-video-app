/*
  Warnings:

  - The primary key for the `ConnectedRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `guestId` to the `ConnectedRooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `ConnectedRooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isGuest` to the `ConnectedRooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ConnectedRooms` DROP FOREIGN KEY `ConnectedRooms_userId_fkey`;

-- AlterTable
ALTER TABLE `ConnectedRooms` DROP PRIMARY KEY,
    ADD COLUMN `guestId` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `isGuest` BOOLEAN NOT NULL,
    MODIFY `userId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `ConnectedRooms` ADD CONSTRAINT `ConnectedRooms_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
