import { NextRequest } from "next/server";
import { ok, unauthorized } from "../../(utils)/responses";
import { prismaClient } from "@/prisma/client";
import { getToken } from "next-auth/jwt";

// retorna todas las subastas excepto las de la empresa del usuario
export async function GET(req: NextRequest) {

  const token = await getToken({ req });

  if (!token || !token.sub) return unauthorized()

  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(token.sub) },
  });

  if (!user) return unauthorized()
  if (!user.companyId) return unauthorized("El usuario no pertenece a una empresa")

  const auctions = await prismaClient.auction.findMany({
    where: {
      status: "available",
      NOT: {
        companySellerId: user.companyId
      }
    },
    select: {
      id: true,
      initialPrice: true,
      units: true,
      pickupLatitude: true,
      pickupLongitude: true,
      createdAt: true,
      status: true,
      companySellerId:true,
      conditions:true,
      contact:true,
      expiresAt:true,
      waste: {
        select: {
          category:true,
          description: true,
          wasteType: {
            select: {
              name: true
            }
          },
          unitType: {
            select: {
              name: true
            }
          }
        }
      },
      companySeller: {
        select: {
          name: true,
          description: true,
          offers: true,
          auctions: true,
        }
      }
    },
  })
  const auctionsWithCounts = await Promise.all(
    auctions.map(async (auction) => {
      const countOffers = auction.companySeller.offers.length
  
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
  
      const countAuctions = auction.companySeller.auctions.length
  
      return {
        ...auction,
        counts: {
          countOffers,
          countSales,
          countPurchases,
          countAuctions,
        },
      };
    })
  );
  return ok({ auctionsWithCounts })
}
