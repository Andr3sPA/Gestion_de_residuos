import { NextRequest } from "next/server";
import { badReq, internal, ok } from "../../utils/responses";
import { prismaClient } from "@/prisma/client";
import { z } from "zod";
import { type } from "os";
import { contains } from "validator";

const searchParamsSchema = z.object({
  searchString: z.string().default(""),
  pageIdx: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(0).default(10),
})

export async function GET(req: NextRequest) {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams)

  const { data: query } = searchParamsSchema.safeParse(searchParams)

  if (!query) {
    return internal("Can't parse params")
  }

  if (query.searchString.length <= 0) {
    const offers = await prismaClient.wasteOffer.findMany({
      skip: query.pageIdx * query.pageSize,
      take: query.pageSize,
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
  const offers = await prismaClient.wasteOffer.findMany({
    skip: query.pageIdx * query.pageSize,
    take: query.pageSize,
    where: {
      waste: {
        OR: [
          {
            wasteType: {
              wasteType: {
                contains: query.searchString,
                mode: "insensitive"
              }
            }
          },
          {
            description: {
              contains: query.searchString,
              mode: "insensitive"
            }
          }
        ]
      }
    }
  })

  return ok({ offers, searchString: query.searchString })

}
