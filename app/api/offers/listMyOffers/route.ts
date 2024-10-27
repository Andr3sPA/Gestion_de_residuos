import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { unauthorized } from "../../(utils)/responses";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return unauthorized();
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    },
  });

  if (!user) return unauthorized();
  if (!user.companyId)
    return unauthorized("El usuario no pertenece a ninguna empresa");

  const offers = await prismaClient.offer.findMany({
    where: {
      OR: [{ status: "waiting" }, { status: "rejected" }],
      companyBuyerId: user.companyId,
    },
    include: {
      companyBuyer: {
        include:{
          offers: true,
        }
      },
      auction: {
        include: {
          companySeller: {        
            include:{
              offers: true,
              auctions:true
          }},
          waste: {
            include: {
              wasteType: true,
              unitType: true,
            },
          },
        },
      },
    },
    orderBy: {
      status: "asc",
    },
  });
  
  // Ahora, para agregar los conteos a cada oferta
  const offersWithCounts = await Promise.all(
    offers.map(async (offer) => {
      const countOffers = offer.auction.companySeller.offers.length
  
      const countSales = await prismaClient.purchase.count({
        where: {
          auction: {
            companySellerId: offer.auction.companySellerId,
          },
        },
      });
  
      const countPurchases = await prismaClient.purchase.count({
        where: {
          offer: {
            companyBuyerId: offer.auction.companySellerId,
          },
        },
      });
  
      const countAuctions = offer.auction.companySeller.auctions.length
  
      return {
        ...offer,
        counts: {
          countOffers,
          countSales,
          countPurchases,
          countAuctions,
        },
      };
    })
  );
 if (!offers)
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  return NextResponse.json({ offersWithCounts }, { status: 200 });
}
