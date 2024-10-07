import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { unauthorized } from "../../(utils)/responses";

const counterOfferSchema = z.object({
  auctionId: z.number(),
  contact: z.string(),
  price: z.number().min(0, { message: "El precio ha de ser 0 o positivo" })
})

// crea una nueva oferta para una subasta
export async function POST(req: NextRequest) {
  const { success, data, error } = counterOfferSchema.safeParse(await req.json())
  const token = await getToken({ req })

  if (!success) {
    // Imprime los errores en la consola
    console.error("Errores de validación:", error.errors);
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }

  if (!token || !token.sub) {
    return unauthorized()
  }
  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(token.sub) }, // Usamos el userId convertido a string
    include: {
      company: true,
    },
  });

  if (!user) return unauthorized()
  if (!user.companyId) return unauthorized("No pertenece a ninguna empresa")

  const offer = await prismaClient.offer.create({
    data: {
      offerPrice: data.price,
      companyBuyer: {
        connect: {
          id: user.companyId
        }
      },
      contact: data.contact,
      auction: {
        connect: {
          id: data.auctionId
        }
      }
    }
  })
  const notification = await prismaClient.notification.create({
    data: {
      type: "auction_has_new_offer",
      description: `La subasta con id ${data.auctionId} tiene una nueva oferta`, // Usa una template string
      auction: {
        connect: {
          id: data.auctionId,
        },
      },
      offer: {
        connect: {
          id: offer.id,
        },
      },
      read: false, // Asegúrate de incluir todos los campos requeridos
    },
  });
  if (!offer || !notification) return NextResponse.json({ error: "internal error" }, { status: 500 })

  return NextResponse.json("counter offer created", { status: 201 })
}
