import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { ok, unauthorized } from "../(utils)/responses";
import { prismaClient } from "@/prisma/client";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) return unauthorized();

  const purchases = await prismaClient.purchase.findMany({
    include: {
      offer: {
        include: {
          companyBuyer: true,
        },
      },
      auction: {
        include: {
          companySeller: true,
          waste: {
            include: {
              unitType: true,
              wasteType: true,
            },
          },
          offers: {
            include: {
              companyBuyer: true,
            },
          },
        },
      },
    },
  });

  return ok({ purchases });
}
