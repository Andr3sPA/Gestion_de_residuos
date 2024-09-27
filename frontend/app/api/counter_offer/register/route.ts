import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { z } from "zod";
import { decrypt } from '@/app/lib/session'

const counterOfferSchema = z.object({
    description: z.string(),
    offer_id: z.number(),
    price:z.number()
})

export async function POST(req: NextRequest) {
    const session = cookies().get('jwt')?.value
    const { success, data } = counterOfferSchema.safeParse(await req.json())
    const payload = await decrypt(session)

    if (!session || !payload) {
        return null
    }


    const user = await prismaClient.user.findUnique({
        where: { id: payload.id }, // Usamos el userId convertido a string
        include: {
          company: true,
        },
    });

    console.log(user);
    

    if (!success) return NextResponse.json(null, { status: 400 })

    const counterOffer = await prismaClient.counterOffer.create({
        data: {
            description: data.description,
            price:data.price,
            companyBuyer: {
                connect: {
                    id: user?.companyId
                }
            },
            buyer: {
                connect: {
                    id: user?.id
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
