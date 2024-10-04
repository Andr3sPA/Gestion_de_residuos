import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

const counterOfferSchema = z.object({
    offer_id: z.number(),
    price:z.number()
})

export async function POST(req: NextRequest) {
    const { success, data,error } = counterOfferSchema.safeParse(await req.json())
    const token = await getToken({ req })

    if (!success) {
        // Imprime los errores en la consola
        console.error("Errores de validación:", error.errors);
        return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    if (!token) {
        return NextResponse.json({ error: "No hay token de sesión" }, { status: 500 });
    }
    const user = await prismaClient.user.findUnique({
        where: { id: token.sub }, // Usamos el userId convertido a string
        include: {
          company: true,
        },
    });

    if (!user) {
        return NextResponse.json({ error: "Usuario inexistente" }, { status: 500 });
    }
    

    if (!success) return NextResponse.json(null, { status: 400 })

    const counterOffer = await prismaClient.wasteCounteroffer.create({
        data: {
            counterPrice:data.price,
            buyerCompany: {
                connect: {
                    id: user?.companyId
                }
            },

            offer: {
                connect: {
                    id: data.offer_id
                }
            }
        }
    })

    if (!counterOffer) return NextResponse.json({ error: "internal error" }, { status: 500 })
    
    return NextResponse.json("counter offer created", { status: 201 })
}