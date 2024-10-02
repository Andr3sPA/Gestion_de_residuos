/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `companyId` on the `Waste` table. All the data in the column will be lost.
  - You are about to drop the column `measureUnit` on the `Waste` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Waste` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Waste` table. All the data in the column will be lost.
  - You are about to drop the `CounterOffer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Offer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Company` table without a default value. This is not possible if the table is not empty.
  - The required column `code` was added to the `Company` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `latitude` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Waste` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyOwnerId` to the `Waste` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitTypeId` to the `Waste` table without a default value. This is not possible if the table is not empty.
  - Added the required column `units` to the `Waste` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wasteTypeId` to the `Waste` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "WasteCategory" AS ENUM ('usable', 'nonUsable');

-- CreateEnum
CREATE TYPE "CounterofferStatus" AS ENUM ('waiting', 'accepted', 'rejected');

-- DropForeignKey
ALTER TABLE "CounterOffer" DROP CONSTRAINT "CounterOffer_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "CounterOffer" DROP CONSTRAINT "CounterOffer_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CounterOffer" DROP CONSTRAINT "CounterOffer_offerId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_wasteId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_counterOfferId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_offerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Waste" DROP CONSTRAINT "Waste_companyId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
ADD COLUMN     "collectionCompanyId" INTEGER,
ADD COLUMN     "phone" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user',
ALTER COLUMN "companyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Waste" DROP COLUMN "companyId",
DROP COLUMN "measureUnit",
DROP COLUMN "quantity",
DROP COLUMN "type",
ADD COLUMN     "category" "WasteCategory" NOT NULL,
ADD COLUMN     "companyOwnerId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expirationDate" TIMESTAMP(3),
ADD COLUMN     "unitTypeId" INTEGER NOT NULL,
ADD COLUMN     "units" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "wasteTypeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CounterOffer";

-- DropTable
DROP TABLE "Offer";

-- DropTable
DROP TABLE "Sale";

-- DropEnum
DROP TYPE "CounterOfferStatus";

-- CreateTable
CREATE TABLE "CollectionCompany" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CollectionCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteType" (
    "id" SERIAL NOT NULL,
    "wasteType" TEXT NOT NULL,

    CONSTRAINT "WasteType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitType" (
    "id" SERIAL NOT NULL,
    "unitName" TEXT NOT NULL,

    CONSTRAINT "UnitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteOffer" (
    "id" SERIAL NOT NULL,
    "companySellerId" INTEGER NOT NULL,
    "wasteId" INTEGER NOT NULL,
    "offerPrice" DECIMAL(65,30) NOT NULL,
    "units" DECIMAL(65,30) NOT NULL,
    "pickupLatitude" DECIMAL(65,30) NOT NULL,
    "pickupLongitude" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OfferStatus" NOT NULL DEFAULT 'available',

    CONSTRAINT "WasteOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WastePurchase" (
    "id" SERIAL NOT NULL,
    "offerId" INTEGER NOT NULL,
    "counterofferId" INTEGER NOT NULL,
    "finalPrice" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WastePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteCounteroffer" (
    "id" SERIAL NOT NULL,
    "offerId" INTEGER NOT NULL,
    "buyerCompanyId" INTEGER NOT NULL,
    "counterPrice" DECIMAL(65,30) NOT NULL,
    "status" "CounterofferStatus" NOT NULL DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WasteCounteroffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteCollection" (
    "id" SERIAL NOT NULL,
    "fromCompanyId" INTEGER NOT NULL,
    "collectionServiceId" INTEGER NOT NULL,
    "wasteId" INTEGER NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "collectionDate" TIMESTAMP(3) NOT NULL,
    "collectionLatitude" DECIMAL(65,30) NOT NULL,
    "collectionLongitude" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WasteCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteCollectionService" (
    "id" SERIAL NOT NULL,
    "collectionCompanyId" INTEGER NOT NULL,
    "wasteTypeId" INTEGER NOT NULL,
    "pricePerUnit" DECIMAL(65,30) NOT NULL,
    "unitTypeId" INTEGER NOT NULL,

    CONSTRAINT "WasteCollectionService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionCompany_code_key" ON "CollectionCompany"("code");

-- CreateIndex
CREATE UNIQUE INDEX "WasteType_wasteType_key" ON "WasteType"("wasteType");

-- CreateIndex
CREATE UNIQUE INDEX "UnitType_unitName_key" ON "UnitType"("unitName");

-- CreateIndex
CREATE UNIQUE INDEX "Company_code_key" ON "Company"("code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_collectionCompanyId_fkey" FOREIGN KEY ("collectionCompanyId") REFERENCES "CollectionCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_companyOwnerId_fkey" FOREIGN KEY ("companyOwnerId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_wasteTypeId_fkey" FOREIGN KEY ("wasteTypeId") REFERENCES "WasteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteOffer" ADD CONSTRAINT "WasteOffer_companySellerId_fkey" FOREIGN KEY ("companySellerId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteOffer" ADD CONSTRAINT "WasteOffer_wasteId_fkey" FOREIGN KEY ("wasteId") REFERENCES "Waste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WastePurchase" ADD CONSTRAINT "WastePurchase_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "WasteOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WastePurchase" ADD CONSTRAINT "WastePurchase_counterofferId_fkey" FOREIGN KEY ("counterofferId") REFERENCES "WasteCounteroffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCounteroffer" ADD CONSTRAINT "WasteCounteroffer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "WasteOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCounteroffer" ADD CONSTRAINT "WasteCounteroffer_buyerCompanyId_fkey" FOREIGN KEY ("buyerCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCollection" ADD CONSTRAINT "WasteCollection_fromCompanyId_fkey" FOREIGN KEY ("fromCompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCollection" ADD CONSTRAINT "WasteCollection_collectionServiceId_fkey" FOREIGN KEY ("collectionServiceId") REFERENCES "WasteCollectionService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCollection" ADD CONSTRAINT "WasteCollection_wasteId_fkey" FOREIGN KEY ("wasteId") REFERENCES "Waste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCollectionService" ADD CONSTRAINT "WasteCollectionService_collectionCompanyId_fkey" FOREIGN KEY ("collectionCompanyId") REFERENCES "CollectionCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCollectionService" ADD CONSTRAINT "WasteCollectionService_wasteTypeId_fkey" FOREIGN KEY ("wasteTypeId") REFERENCES "WasteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteCollectionService" ADD CONSTRAINT "WasteCollectionService_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
