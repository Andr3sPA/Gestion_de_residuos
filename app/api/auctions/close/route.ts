import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { internal, unauthorized } from "../../(utils)/responses";
const closeNotificationSchema = z.object({
  id: z.number(),
});
export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const { success, data, error } = closeNotificationSchema.safeParse(
    await req.json(),
  );
  if (!success) {
    // Imprime los errores en la consola
    console.error("Errores de validación:", error.errors);
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }
  if (!token || !token.sub) {
    return unauthorized();
  }
  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(token.sub) },
    include: {
      company: {
        include: {
          auctions: true,
        },
      },
    },
  });
  if (!user || !user.company) return unauthorized();
  // Verificar si la subasta con el data.id está en el arreglo de subastas de la compañía
  const auctionExists = user.company.auctions.some(
    (auction) => auction.id === data.id,
  );

  if (!auctionExists) {
    return unauthorized();
  }
  const auction = await prismaClient.auction.update({
    where: {
      id: data.id,
      status: "available",
    },
    data: {
      status: "closed",
    },
  });

  if (!auction) return internal();

  // Rechazar automáticamente todas las ofertas realizadas a esta subasta
  const offers = await prismaClient.offer.updateMany({
    where: {
      auctionId: auction.id,
    },
    data: {
      status: "rejected",
    },
  });

  if (!offers) return internal();

  return NextResponse.json(
    { message: "Subasta cerrada con éxito" },
    { status: 200 },
  );
}
