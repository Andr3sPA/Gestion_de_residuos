import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import { unauthorized } from "../../(utils)/responses";

const wasteSchema = z.object({
  description: z.string().min(1, { message: "La descripción es requerida." }),
  unitType: z.string().min(1, { message: "El tipo de unidad es requerido." }),
  units: z.number().min(1, { message: "La cantidad de unidades debe ser un número positivo." }),
  wasteType: z.string().min(1, { message: "El tipo de residuo es requerido." }),
  category: z.enum(["usable", "nonUsable"], {
    errorMap: () => ({ message: "La categoría de residuos debe ser 'usable' o 'nonUsable'." })
  }),
});
export async function GET(req: NextRequest){
  const wasteTypes = await prismaClient.wasteType.findMany({
      select: {
          name:true
      },
  });

  const unitTypes = await prismaClient.unitType.findMany({
      select: {
          name:true
      },
  });
  if (!wasteTypes || !unitTypes) return NextResponse.json({ error: "internal error" }, { status: 500 })
  return NextResponse.json({ wasteTypes, unitTypes }, { status: 200 });
}
export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const body = await req.json();
  const { success, data, error } = wasteSchema.safeParse(body);

  if (!success) {
    // Imprime los errores en la consola
    console.error("Errores de validación:", error.errors);
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }

  if (!token || !token.sub) {
    return NextResponse.json({ error: "No hay token de sesión" }, { status: 500 });
  }

  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(token.sub) }, // Usamos el userId convertido a string

  });

  if (!user) return unauthorized()
  if (!user.companyId) return unauthorized("El usuario no pertenece a ninguna empresa")

  const name = await prismaClient.wasteType.findUnique({
    where: {
      name: data.wasteType,
    },
  });

  const unitType = await prismaClient.unitType.findUnique({
    where: {
      name: data.unitType,
    },
  });

  const waste = await prismaClient.waste.create({
    data: {
      description: data.description,
      units: data.units,
      companyOwner: {
        connect: {
          id: user?.companyId
        }
      },
      wasteType: {
        connect: {
          id: name?.id
        }
      },
      unitType: {
        connect: {
          id: unitType?.id
        }
      },
      category: data.category
    }
  });

  if (!waste) return NextResponse.json({ error: "internal error" }, { status: 500 });
  return NextResponse.json("waste created", { status: 201 });
}
