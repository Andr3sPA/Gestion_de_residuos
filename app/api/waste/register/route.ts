import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
const wasteSchema = z.object({
    description: z.string(),
    nameUnitType: z.string(),
    units: z.number(),
    nameWasteType: z.string(),
    wasteCategory:z.string(),
    expirationDate:z.date()
})

export async function POST(req: NextRequest) {
    const token = await getToken({ req })
    const { success, data } = wasteSchema.safeParse(await req.json())

    if (!token) {
        return NextResponse.json({ error: "No hay token de sesión" }, { status: 500 })
    }


    const user = await prismaClient.user.findUnique({
        where: { id: token.sub }, // Usamos el userId convertido a string
        include: {
          company: true,
        },
    });


    if (!success) return NextResponse.json(null, { status: 400 })

    const wasteType = await prismaClient.wasteType.findUnique({
        where: {
            wasteType: data.nameWasteType,
        },
        });
    const unitType = await prismaClient.unitType.findUnique({
        where: {
            unitName:data.nameUnitType,
    },
    });        
    const waste = await prismaClient.waste.create({
        data: {
            description: data.description,
            units: data.units,
            expirationDate:data.expirationDate,
            companyOwner: {
                connect: {
                    id: user?.companyId
                }
            },
            wasteType: {
                connect: {
                    id: wasteType.id
                }
            },    
            unitType: {
                connect: {
                    id: unitType.id
                }
            },              
            wasteCategory:data.wasteCategory       
            
        }
    })

    if (!waste) return NextResponse.json({ error: "internal error" }, { status: 500 })
    console.log(waste)
    return NextResponse.json("waste created", { status: 201 })
}
