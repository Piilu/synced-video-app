-- DropForeignKey
ALTER TABLE `Room` DROP FOREIGN KEY `Room_videoId_fkey`;

-- AlterTable
ALTER TABLE `Room` MODIFY `videoId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
