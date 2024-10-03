import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";

const wasteSchema = z.object({
    description: z.string().min(1, { message: "La descripción es requerida." }),
    nameUnitType: z.string().min(1, { message: "El tipo de unidad es requerido." }),
    units: z.number().min(1, { message: "La cantidad de unidades debe ser un número positivo." }),
    nameWasteType: z.string().min(1, { message: "El tipo de residuo es requerido." }),
    category: z.enum(["usable", "nonUsable"], { 
        errorMap: () => ({ message: "La categoría de residuos debe ser 'usable' o 'nonUsable'." }) 
    }),
    expirationDate: z.date().refine(date => !isNaN(date.getTime()), {
        message: "La fecha de expiración debe ser una fecha válida."
    }),
});

export async function POST(req: NextRequest) {
    const token = await getToken({ req });
    const body = await req.json();

    // Convierte la cadena de fecha en un objeto Date
    if (typeof body.expirationDate === 'string') {
        body.expirationDate = new Date(body.expirationDate);
    }

    console.log(body);
    
    // Valida el cuerpo con el esquema de Zod
    const { success, data, error } = wasteSchema.safeParse(body);

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

    });
    
    const wasteType = await prismaClient.wasteType.findUnique({
        where: {
            wasteType: data.nameWasteType,
        },
    });

    const unitType = await prismaClient.unitType.findUnique({
        where: {
            unitName: data.nameUnitType,
        },
    });

    const waste = await prismaClient.waste.create({
        data: {
            description: data.description,
            units: data.units,
            expirationDate: new Date(data.expirationDate),
            companyOwner: {
                connect: {
                    id: user?.companyId
                }
            },
            wasteType: {
                connect: {
                    id: wasteType?.id // Asegúrate de manejar casos donde wasteType sea null
                }
            },
            unitType: {
                connect: {
                    id: unitType?.id // Asegúrate de manejar casos donde unitType sea null
                }
            },
            category: data.category
        }
    });

    if (!waste) return NextResponse.json({ error: "internal error" }, { status: 500 });
    console.log(waste);
    return NextResponse.json("waste created", { status: 201 });
}
