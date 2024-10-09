import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { unauthorized } from "../../(utils)/responses";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) {
    return NextResponse.json({ error: "No hay token de sesión" }, { status: 500 });
  }
  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(token.sub) },
  });
  if (!user) return unauthorized();
  if (!user.companyId) return unauthorized("El usuario no pertenece a ninguna empresa");  
  const deletedNotifications = await prismaClient.notification.deleteMany({
    where: {
      OR: [
        { 
          OR: [{type: "offer_accepted"},{type: "offer_rejected"}],
          offer: {
            companyBuyerId: user.companyId,
        }
         }, 
         

        {
            type: "auction_has_new_offer",
            auction:{
                companySellerId: user.companyId,
            }
        }
            
      ],
    },
  });

  if (!deletedNotifications)
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  return NextResponse.json({ status: 201 });
}