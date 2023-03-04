-- CreateTable
CREATE TABLE `ConnectedRooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `socketId` VARCHAR(191) NOT NULL,
    `roomId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ConnectedRooms` ADD CONSTRAINT `ConnectedRooms_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConnectedRooms` ADD CONSTRAINT `ConnectedRooms_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
