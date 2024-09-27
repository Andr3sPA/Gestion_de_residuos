import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { z } from "zod";
import { decrypt } from '@/app/lib/session'

const wasteSchema = z.object({
    type: z.string(),
    description: z.string(),
    measureUnit: z.string(),
    quantity: z.number()
})

export async function POST(req: NextRequest) {
    const session = cookies().get('jwt')?.value
    const { success, data } = wasteSchema.safeParse(await req.json())
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

    const waste = await prismaClient.waste.create({
        data: {
            type: data.type,
            description: data.description,
            measureUnit: data.measureUnit,
            quantity: data.quantity,
            company: {
                connect: {
                    id: user?.companyId
                }
            }
        }
    })

    if (!waste) return NextResponse.json({ error: "internal error" }, { status: 500 })

    return NextResponse.json("waste created", { status: 201 })
}
