import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { z } from "zod";
import { decrypt } from '@/app/lib/session'

const offerSchema = z.object({
    description: z.string(),
    waste_id: z.number(),
    price:z.number(),
    quantity: z.number()
})

export async function POST(req: NextRequest) {
    const session = cookies().get('jwt')?.value
    const { success, data } = offerSchema.safeParse(await req.json())
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

    const offer = await prismaClient.offer.create({
        data: {
            description: data.description,
            price:data.price,
            quantity: data.quantity, //TODO:verify the quantity is not greater than the available quantity
            companySeller: {
                connect: {
                    id: user?.companyId
                }
            },
            seller: {
                connect: {
                    id: user?.id
                }
            },
            waste: {
                connect: {
                    id: data.waste_id
                }
            }
        }
    })

    if (!offer) return NextResponse.json({ error: "internal error" }, { status: 500 })
  
    return NextResponse.json("offer created", { status: 201 })
}
