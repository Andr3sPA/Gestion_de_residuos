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
  const CO2Avoided: any[] = [];
  const wasteTypes = await prismaClient.wasteType.findMany();
  if (!wasteTypes)
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  for (let i = 0; i < wasteTypes.length; i++) {
    const wasteSum = await prismaClient.auction.aggregate({
      where: {
        OR: [
          {
            companySellerId: user?.companyId,
            waste: {
              wasteTypeId: wasteTypes[i].id,
            },
            status: "sold",
          },
          {
            status: "sold",
            purchase: {
              offer: {
                companyBuyerId: user?.companyId,
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

  return NextResponse.json(CO2Avoided, { status: 201 });
}
