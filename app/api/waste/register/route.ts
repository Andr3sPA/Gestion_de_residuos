import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
const wasteSchema = z.object({
    type: z.string(),
    description: z.string(),
    measureUnit: z.string(),
    quantity: z.number()
})

export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    const { success, data } = wasteSchema.safeParse(await req.json())

    if (!token) {
        return null
    }


    const user = await prismaClient.user.findUnique({
        where: { id: token.sub }, // Usamos el userId convertido a string
        include: {
          company: true,
        },
    });


    if (!success) return NextResponse.json(null, { status: 400 })

    const waste = await prismaClient.waste.create({
        data: {
            type: data.type,
            description: data.description,
            measureUnit: data.measureUnit,
            quantity: data.quantity,
            companyOwner: {
                connect: {
                    id: user?.companyId
                }
            },
            
        }
    })

    if (!waste) return NextResponse.json({ error: "internal error" }, { status: 500 })

    return NextResponse.json("waste created", { status: 201 })
}
