import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { unauthorized } from "../../(utils)/responses";
import { z } from "zod";

const offerSchema = z.object({
  auction_id: z.number(),
});

// Retorna las ofertas realizadas por la empresa del usuario
// Retorna las ofertas realizadas por la empresa del usuario
export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  const { searchParams } = new URL(req.url);
  const auction_id = searchParams.get("auction_id");

  const { success, data, error } = offerSchema.safeParse({ auction_id: parseInt(auction_id || "0") });

  if (!success) {
    console.error("Errores de validación:", error.errors);
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }

  if (!token || !token.sub) {
    return unauthorized();
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    },
  });

  if (!user) return unauthorized();
  if (!user.companyId) return unauthorized("El usuario no pertenece a ninguna empresa");

  const auction = await prismaClient.auction.findUnique({
    where: {
      id: data.auction_id,
      status:"available"
    },
    select: {
      companySellerId: true,
      offers: {
        where:{
          status:"waiting",
        },
        include: {
          companyBuyer: true,
        },
      },
    },
  });

  if (!auction) return NextResponse.json({ error: "internal error" }, { status: 500 });
  
  if (auction.companySellerId != user.companyId) return unauthorized();
  
  return NextResponse.json({ offers: auction.offers, hasOffers:true }, { status: 200 });
}
