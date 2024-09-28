/*
  Warnings:

  - The primary key for the `CounterOffer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CounterOffer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Offer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Offer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Sale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Sale` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Waste` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Waste` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `buyerId` on the `CounterOffer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `offerId` on the `CounterOffer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sellerId` on the `Offer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `wasteId` on the `Offer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `counterOfferId` on the `Sale` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `offerId` on the `Sale` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CounterOffer" DROP CONSTRAINT "CounterOffer_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "CounterOffer" DROP CONSTRAINT "CounterOffer_offerId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_wasteId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_counterOfferId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_offerId_fkey";

-- AlterTable
ALTER TABLE "CounterOffer" DROP CONSTRAINT "CounterOffer_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "buyerId",
ADD COLUMN     "buyerId" INTEGER NOT NULL,
DROP COLUMN "offerId",
ADD COLUMN     "offerId" INTEGER NOT NULL,
ADD CONSTRAINT "CounterOffer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "sellerId",
ADD COLUMN     "sellerId" INTEGER NOT NULL,
DROP COLUMN "wasteId",
ADD COLUMN     "wasteId" INTEGER NOT NULL,
ADD CONSTRAINT "Offer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "counterOfferId",
ADD COLUMN     "counterOfferId" INTEGER NOT NULL,
DROP COLUMN "offerId",
ADD COLUMN     "offerId" INTEGER NOT NULL,
ADD CONSTRAINT "Sale_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Waste" DROP CONSTRAINT "Waste_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Waste_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "CounterOffer" ADD CONSTRAINT "CounterOffer_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterOffer" ADD CONSTRAINT "CounterOffer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_wasteId_fkey" FOREIGN KEY ("wasteId") REFERENCES "Waste"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_counterOfferId_fkey" FOREIGN KEY ("counterOfferId") REFERENCES "CounterOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
