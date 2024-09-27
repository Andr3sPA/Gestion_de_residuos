/*
  Warnings:

  - Added the required column `firtsName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firtsName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
