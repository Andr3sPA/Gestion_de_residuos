import { NextRequest } from "next/server";
import { badReq, internal, ok } from "../../utils/responses";
import { prismaClient } from "@/prisma/client";

export async function GET(req: NextRequest) {

  const offers = await prismaClient.wasteOffer.findMany({
    where: {
      status: "available"
    },
    select: {
      id: true,
      offerPrice: true,
      units: true,
      pickupLatitude: true,
      pickupLongitude: true,
      createdAt: true,
      status: true,
      waste: {
        select: {
          description: true,
          expirationDate: true,
          wasteType: {
            select: {
              wasteType: true
            }
          },
          unitType: {
            select: {
              unitName: true
            }
          }
        }
      },
      companySeller: {
        select: {
          name: true,
          description: true
        }
      }
    },
  })

  return ok({ offers })
}
