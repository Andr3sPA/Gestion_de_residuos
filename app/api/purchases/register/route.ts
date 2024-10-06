import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import { badReq, forbidden, notFound, unauthorized } from "../../(utils)/responses";

const offerSchema = z.object({
  auction_id: z.number(),
  offer_id: z.number(),
  status: z.string(),
});

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const { success, data } = offerSchema.safeParse(await req.json());

  if (!token || !token.sub) {
    return unauthorized();
  }

  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(token.sub) }, // Usamos el userId convertido a string
  });

  if (!user) return unauthorized();
  if (!user.companyId) return unauthorized("No pertenece a ninguna empresa");

  const auction = await prismaClient.auction.findUnique({
    where: { id: data?.auction_id }, // Usamos el userId convertido a string
  });

  const offer = await prismaClient.offer.findUnique({
    where: { id: data?.offer_id }, // Usamos el userId convertido a string
  });

  if (!auction || !offer) return notFound("Subasta u oferta no encontrados")

  if (user.companyId != auction.companySellerId) {
    return forbidden("You are not part of the sellers company")
  }

  if (!success) return badReq()

  if (data.status == "rejected") {
    const offer = await prismaClient.offer.update({
      data: {
        status: "rejected",
      },
      where: {
        id: data.offer_id,
      },
    });
    return NextResponse.json("counter offer rejected", { status: 201 });
  } else if (data.status == "accepted") {
    const offer = await prismaClient.offer.update({
      data: {
        status: "accepted",
      },
      where: {
        id: data.offer_id,
      },
    });
    const auction = await prismaClient.auction.update({
      data: {
        status: "sold",
      },
      where: {
        id: data.auction_id,
      },
    });

    const purchase = await prismaClient.purchase.create({
      data: {
        finalPrice: offer.offerPrice,
        offer: {
          connect: {
            id: data.offer_id,
          },
        },
        auction: {
          connect: {
            id: data.auction_id,
          },
        },
      },
    });

    if (!purchase)
      return NextResponse.json({ error: "internal error" }, { status: 500 });

    return NextResponse.json("counter offer accepted", { status: 201 });
  }
}