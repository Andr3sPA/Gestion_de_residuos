import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { notAuthorized as unauthorized } from "../../utils/responses";

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

  const offers = await prismaClient.wasteOffer.findMany({
    where: { companySellerId: user.companyId },
    include: {
      companySeller: true,
      waste: {
        include: {
          unitType: true
        }
      },
    }
  })
  if (!offers) return NextResponse.json({ error: "internal error" }, { status: 500 })
  return NextResponse.json(offers, { status: 201 })
}
