import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { unauthorized } from "../../(utils)/responses";

// returns a company's auctions
export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  // TODO: use middleware
  if (!token || !token.sub) {
    return unauthorized("No hay token de sesión");
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    },
  });

  if (!user) return unauthorized();
  if (!user.companyId)
    return unauthorized("El usuario no pertenece a ninguna empresa");

  const notifications = await prismaClient.notification.findMany({
    where: {
      OR: [
        {
          auction: {
            companySellerId: user.companyId,
          },
          type: "auction_has_new_offer",
        },
        {
          offer: {
            companyBuyerId: user.companyId,
          },
          type: "offer_accepted",
        },
        {
          offer: {
            companyBuyerId: user.companyId,
          },
          type: "offer_rejected",
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  const readCount = await prismaClient.notification.count({  
    where: {  
      read:false,
      OR: [
        {
          auction: {
            companySellerId: user.companyId,
          },
          type: "auction_has_new_offer",
        },
        {
          offer: {
            companyBuyerId: user.companyId,
          },
          type: "offer_accepted",
        },        {
          offer: {
            companyBuyerId: user.companyId,
          },
          type: "offer_rejected",
        },
      ],
    },  
  });
  if (!notifications)
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  return NextResponse.json({readCount,notifications}, { status: 201 });
}
