/*
  Warnings:

  - The primary key for the `ConnectedRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `ConnectedRooms` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`userId`);
