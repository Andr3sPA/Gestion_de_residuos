-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('waiting', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('companyManager', 'companyAdmin', 'superAdmin');

-- CreateEnum
CREATE TYPE "WasteCategory" AS ENUM ('usable', 'nonUsable');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('available', 'closed', 'expired', 'sold');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('waiting', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('offer_accepted', 'offer_rejected', 'auction_has_new_offer');

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" "NotificationType" NOT NULL,
    "description" TEXT NOT NULL,
    "offerId" INTEGER,
    "auctionId" INTEGER,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'companyManager',
    "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'waiting',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waste" (
    "id" SERIAL NOT NULL,
    "companyOwnerId" INTEGER NOT NULL,
    "wasteTypeId" INTEGER NOT NULL,
    "category" "WasteCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "units" DECIMAL(65,30) NOT NULL,
    "unitTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WasteType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UnitType_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WasteType_name_key" ON "WasteType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnitType_name_key" ON "UnitType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_offerId_key" ON "Purchase"("offerId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_companyOwnerId_fkey" FOREIGN KEY ("companyOwnerId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_wasteTypeId_fkey" FOREIGN KEY ("wasteTypeId") REFERENCES "WasteType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waste" ADD CONSTRAINT "Waste_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
