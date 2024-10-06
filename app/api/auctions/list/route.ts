import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { unauthorized } from "../../(utils)/responses";

// returns a company's auctions
export async function GET(req: NextRequest) {
  const token = await getToken({ req })

  // TODO: use middleware
  if (!token || !token.sub) {
    return unauthorized("No hay token de sesión");
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    }
  })

  if (!user) return unauthorized()
  if (!user.companyId) return unauthorized("El usuario no pertenece a ninguna empresa")

  const auctions = await prismaClient.auction.findMany({
    where: { companySellerId: user.companyId },
    include: {
      companySeller: true,
      waste: {
        include: {
          unitType: true,
          wasteType:true
        }
      },
    }
  })
  if (!auctions) return NextResponse.json({ error: "internal error" }, { status: 500 })
  return NextResponse.json(auctions, { status: 201 })
}
