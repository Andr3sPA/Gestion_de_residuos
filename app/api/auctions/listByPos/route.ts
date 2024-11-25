import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { ok, unauthorized } from "../../(utils)/responses";
import { prismaClient } from "@/prisma/client";
import { Auction } from "@/app/manage/auctions/page";

export type AuctionsByPos = {
  pos: number[];
  auctions: Auction[];
}[];

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) return unauthorized();
  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    },
  });

  const auctions = await prismaClient.auction.findMany({
    where: {
      status: "available",
      companySellerId: user?.companyId ? { not: user.companyId } : undefined,
    },
    select: {
      id: true,
      initialPrice: true,
      units: true,
      pickupLatitude: true,
      pickupLongitude: true,
      createdAt: true,
      status: true,
      companySellerId: true,
      conditions: true,
      contact: true,
      expiresAt: true,
      wasteId: true,
      waste: {
        select: {
          category: true,
          description: true,
          wasteType: {
            select: {
              name: true,
            },
          },
          unitType: {
            select: {
              name: true,
            },
          },
        },
      },
      companySeller: {
        select: {
          name: true,
          description: true,
          offers: true,
          auctions: true,
        },
      },
    },
  });
  const auctionsWithCounts = await Promise.all(
    auctions.map(async (auction) => {
      const countOffers = auction.companySeller.offers.length;

      const countSales = await prismaClient.purchase.count({
        where: {
          auction: {
            companySellerId: auction.companySellerId,
          },
        },
      });

      const countPurchases = await prismaClient.purchase.count({
        where: {
          offer: {
            companyBuyerId: auction.companySellerId,
          },
        },
      });

      const countAuctions = auction.companySeller.auctions.length;

      return {
        ...auction,
        counts: {
          countOffers,
          countSales,
          countPurchases,
          countAuctions,
        },
      };
    }),
  );

  const auctionsByPos: {
    [pos: string]: any[];
  } = {};

  auctionsWithCounts.forEach((auction) => {
    // degrees less than 0.00001 (~ < 10 meters) are discarded
    const pos = `${auction.pickupLatitude.toFixed(5)},${auction.pickupLongitude.toFixed(5)}`;
    if (!(pos in auctionsByPos)) {
      auctionsByPos[pos] = [];
    }
    auctionsByPos[pos].push(auction);
  });

  const auctionsAvailable: AuctionsByPos = Object.entries(auctionsByPos).map(
    ([k, v]) => ({
      pos: k.split(",").map((l) => parseFloat(l)),
      auctions: v,
    }),
  );
  return ok({ auctions: auctionsAvailable });
}
