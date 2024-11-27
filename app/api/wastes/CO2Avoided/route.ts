import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { internal, ok, unauthorized } from "../../(utils)/responses";
import { $Enums } from "@prisma/client";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  let loggedIn = false;
  let user = undefined;
  if (token && token.sub) {
    user = await prismaClient.user.findUnique({
      where: {
        id: parseInt(token.sub),
      },
    });
    if (!user) return unauthorized();
    if (user.role !== "superAdmin" && !user.companyId)
      return unauthorized("El usuario no pertenece a ninguna empresa");
    loggedIn = true;
  }

  const wasteTypes = await prismaClient.wasteType.findMany();
  if (!wasteTypes) return internal("no waste types present");

  const CO2Avoided: any[] = [];
  for (let i = 0; i < wasteTypes.length; i++) {
    const wasteSum = await prismaClient.auction.aggregate({
      where: {
        OR: [
          {
            companySellerId:
              loggedIn && user?.companyId ? user.companyId : undefined,
            waste: {
              wasteTypeId: wasteTypes[i].id,
            },
            status: "sold",
          },
          {
            status: "sold",
            purchase: {
              offer: {
                companyBuyerId:
                  loggedIn && user?.companyId ? user?.companyId : undefined,
                status: "accepted",
              },
            },
            waste: {
              wasteTypeId: wasteTypes[i].id,
            },
          },
        ],
      },
      _sum: {
        units: true,
      },
    });
    CO2Avoided.push({
      name: wasteTypes[i].name,
      avoidedCO2:
        (Number(wasteSum._sum.units) ?? 0) *
        Number(wasteTypes[i].emissionFactor),
    });
  }

  return ok({ CO2Avoided });
}
