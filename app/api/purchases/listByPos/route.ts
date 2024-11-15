import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { ok, unauthorized } from "../../(utils)/responses";
import { prismaClient } from "@/prisma/client";

type WasteSold = {
  wasteType: string;
  units: number;
  unitType: string;
  date: Date;
};

export type PurchasesByPos = {
  pos: number[];
  wastes: WasteSold[];
}[];

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) return unauthorized();

  const allPurchases = await prismaClient.purchase.findMany({
    include: {
      auction: {
        include: {
          waste: {
            include: {
              wasteType: true,
              unitType: true,
            },
          },
        },
      },
    },
  });

  const purchasesByPos: {
    [pos: string]: WasteSold[];
  } = {};

  allPurchases.forEach((purchase) => {
    // degrees less than 0.00001 (~ < 10 meters) are discarded
    const pos = `${purchase.auction.pickupLatitude.toFixed(5)},${purchase.auction.pickupLongitude.toFixed(5)}`;
    if (!(pos in purchasesByPos)) {
      purchasesByPos[pos] = [];
    }
    purchasesByPos[pos].push({
      wasteType: purchase.auction.waste.wasteType.name,
      units: purchase.auction.units.toNumber(),
      unitType: purchase.auction.waste.unitType.name,
      date: purchase.createdAt,
    });
  });

  const purchases: PurchasesByPos = Object.entries(purchasesByPos).map(
    ([k, v]) => ({
      pos: k.split(",").map((l) => parseFloat(l)),
      wastes: v,
    }),
  );

  return ok({ purchases });
}
