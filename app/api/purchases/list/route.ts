import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { unauthorized } from "../../(utils)/responses";

// retorna las compras de la empresa del usuario
export async function GET(req: NextRequest) {
  const token = await getToken({ req })

  if (!token || !token.sub) return unauthorized()

  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    },
  })

  if (!user) return unauthorized()
  if (!user.companyId) return unauthorized("No pertenece a ninguna empresa")

  const sales = await prismaClient.purchase.findMany({
    where: {
      OR: [
        {
          auction: {
            companySellerId: user.companyId,
          },
        },
        {
          offer: {
            companyBuyerId: user.companyId
          },
        },
      ],
    },
    include: {
      auction: true,
      offer: true,
    },
  });

  if (!sales) return NextResponse.json({ error: "internal error" }, { status: 500 })

  return NextResponse.json(sales, { status: 201 })
}
