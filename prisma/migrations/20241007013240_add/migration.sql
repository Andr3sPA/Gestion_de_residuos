/*
  Warnings:

  - The values [available,expired,sold] on the enum `OfferStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [user,admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `code` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `unitName` on the `UnitType` table. All the data in the column will be lost.
  - You are about to drop the column `collectionCompanyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expirationDate` on the `Waste` table. All the data in the column will be lost.
  - You are about to drop the column `wasteType` on the `WasteType` table. All the data in the column will be lost.
  - You are about to drop the `CollectionCompany` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WasteCollection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WasteCollectionService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WasteCounteroffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WasteOffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WastePurchase` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `UnitType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `WasteType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `UnitType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `WasteType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('waiting', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('available', 'closed', 'expired', 'sold');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('offer_status_changed', 'auction_has_new_offer');

-- AlterEnum
BEGIN;
CREATE TYPE "OfferStatus_new" AS ENUM ('waiting', 'accepted', 'rejected');
ALTER TABLE "WasteOffer" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Offer" ALTER COLUMN "status" TYPE "OfferStatus_new" USING ("status"::text::"OfferStatus_new");
ALTER TYPE "OfferStatus" RENAME TO "OfferStatus_old";
ALTER TYPE "OfferStatus_new" RENAME TO "OfferStatus";
DROP TYPE "OfferStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('companyManager', 'companyAdmin', 'superAdmin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'companyManager';
COMMIT;

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_collectionCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "WasteCollection" DROP CONSTRAINT "WasteCollection_collectionServiceId_fkey";

-- DropForeignKey
ALTER TABLE "WasteCollection" DROP CONSTRAINT "WasteCollection_fromCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "WasteCollection" DROP CONSTRAINT "WasteCollection_wasteId_fkey";

-- DropForeignKey
ALTER TABLE "WasteCollectionService" DROP CONSTRAINT "WasteCollectionService_collectionCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "WasteCollectionService" DROP CONSTRAINT "WasteCollectionService_unitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "WasteCollectionService" DROP CONSTRAINT "WasteCollectionService_wasteTypeId_fkey";

-- DropForeignKey
ALTER TABLE "WasteCounteroffer" DROP CONSTRAINT "WasteCounteroffer_buyerCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "WasteCounteroffer" DROP CONSTRAINT "WasteCounteroffer_offerId_fkey";

-- DropForeignKey
ALTER TABLE "WasteOffer" DROP CONSTRAINT "WasteOffer_companySellerId_fkey";

-- DropForeignKey
ALTER TABLE "WasteOffer" DROP CONSTRAINT "WasteOffer_wasteId_fkey";

-- DropForeignKey
ALTER TABLE "WastePurchase" DROP CONSTRAINT "WastePurchase_counterofferId_fkey";

-- DropForeignKey
ALTER TABLE "WastePurchase" DROP CONSTRAINT "WastePurchase_offerId_fkey";

-- DropIndex
DROP INDEX "Company_code_key";

-- DropIndex
DROP INDEX "UnitType_unitName_key";

-- DropIndex
DROP INDEX "WasteType_wasteType_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "code",
DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "UnitType" DROP COLUMN "unitName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "collectionCompanyId",
DROP COLUMN "phone",
ADD COLUMN     "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'waiting',
ALTER COLUMN "role" SET DEFAULT 'companyManager';

-- AlterTable
ALTER TABLE "Waste" DROP COLUMN "expirationDate";

-- AlterTable
ALTER TABLE "WasteType" DROP COLUMN "wasteType",
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "CollectionCompany";

-- DropTable
DROP TABLE "WasteCollection";

-- DropTable
DROP TABLE "WasteCollectionService";

-- DropTable
DROP TABLE "WasteCounteroffer";

-- DropTable
DROP TABLE "WasteOffer";

-- DropTable
DROP TABLE "WastePurchase";

-- DropEnum
DROP TYPE "CounterofferStatus";

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" "NotificationType" NOT NULL,
    "description" TEXT NOT NULL,
    "offerId" INTEGER,
    "auctionId" INTEGER,
    "read" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" SERIAL NOT NULL,
    "companySellerId" INTEGER NOT NULL,
    "wasteId" INTEGER NOT NULL,
    "initialPrice" DECIMAL(65,30) NOT NULL,
    "conditions" TEXT,
    "contact" TEXT NOT NULL,
    "units" DECIMAL(65,30) NOT NULL,
    "pickupLatitude" DECIMAL(65,30) NOT NULL,
    "pickupLongitude" DECIMAL(65,30) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AuctionStatus" NOT NULL DEFAULT 'available',

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "offerId" INTEGER NOT NULL,
    "finalPrice" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "companyBuyerId" INTEGER NOT NULL,
    "contact" TEXT NOT NULL,
    "offerPrice" DECIMAL(65,30) NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_offerId_key" ON "Purchase"("offerId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitType_name_key" ON "UnitType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WasteType_name_key" ON "WasteType"("name");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_companySellerId_fkey" FOREIGN KEY ("companySellerId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_wasteId_fkey" FOREIGN KEY ("wasteId") REFERENCES "Waste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_companyBuyerId_fkey" FOREIGN KEY ("companyBuyerId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
