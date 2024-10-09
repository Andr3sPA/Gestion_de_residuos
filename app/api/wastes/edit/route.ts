import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import { unauthorized } from "../../(utils)/responses";

const wasteSchema = z.object({
  wasteId: z.number(),
  units: z.number(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const waste_id = searchParams.get("waste_id");
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return NextResponse.json({ error: "No hay token de sesión" }, { status: 500 });
  }

  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(token.sub) },
  });

  if (!user) return unauthorized();


  if (!waste_id) return NextResponse.json({ error: "Missing waste id" }, { status: 500 });
    const waste = await prismaClient.waste.findUnique({
      where: { id: parseInt(waste_id as string) },
      include: {
        Auction:true,
      },
    });

    if (waste?.companyOwnerId !== user.companyId) {
      return unauthorized("El usuario no pertenece a la empresa del residuo");
    }

    
  
  if (!waste) 
    return NextResponse.json({ error: "internal error" }, { status: 500 });  
  let totalOfferUnit: number = 0;

  // Sumar las unidades de las ofertas existentes
  for (let offer of waste.Auction) {
    totalOfferUnit += parseFloat(offer.units.toString());
  }

  // Convierte waste.units a número
  const wasteUnits = waste.units.toNumber();

  // Verifica los tipos antes de comparar
  if (typeof totalOfferUnit !== 'number' || typeof wasteUnits !== 'number') {
    return NextResponse.json({ error: "Error en los datos." }, { status: 400 });
  }
  // Comparación
  if (totalOfferUnit > wasteUnits) {
    return NextResponse.json({ error: "Las unidades que deseas ofertar son mayores a las unidades disponibles" }, { status: 400 });
  }
  return NextResponse.json({ totalOfferUnit }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const body = await req.json();
  const { success, data, error } = wasteSchema.safeParse(body);

  if (!success) {
    console.error("Errores de validación:", error.errors);
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }

  if (!token || !token.sub) {
    return NextResponse.json({ error: "No hay token de sesión" }, { status: 500 });
  }

  const user = await prismaClient.user.findUnique({
    where: { id: parseInt(token.sub) },
  });

  if (!user) return unauthorized();
  if (!user.companyId) return unauthorized("El usuario no pertenece a ninguna empresa");
  const waste = await prismaClient.waste.findUnique({
    where: { id: data.wasteId },
    include: {
      Auction:true,
    },
  });
  let totalOfferUnit: number = 0;
  if (!waste) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }

  // Sumar las unidades de las ofertas existentes
  for (let offer of waste.Auction) {
    totalOfferUnit += parseFloat(offer.units.toString());
  }

  // Sumar las unidades de la nueva oferta
  totalOfferUnit += data.units;

  // Comparación
  if (totalOfferUnit > data.units) {
    return NextResponse.json({ error: "Las unidades que ingreso son menores a las que ha subastado en total" }, { status: 400 });
  }
    await prismaClient.waste.update({
    where: { id: data.wasteId },
    data: {
      units: data.units,
    },
  });

  if (waste?.companyOwnerId !== user.companyId) {
    return unauthorized("El usuario no pertenece a la empresa del residuo");
  }

  return NextResponse.json("waste edited", { status: 201 });
}
