import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";

const offerSchema = z.object({
  waste_id: z.number(),
  price: z.number(),
  units: z.number(),
  pickupLatitude: z.number(),
  pickupLongitude: z.number(),
});

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const body = await req.json();
  const { success, data, error } = offerSchema.safeParse(body);

  if (!success) {
    // Imprime los errores en la consola
    console.error("Errores de validación:", error.errors);
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "No hay token de sesión" }, { status: 500 });
  }

  const user = await prismaClient.user.findUnique({
    where: { id: token.sub },
  });

  const waste = await prismaClient.waste.findUnique({
    where: { id: body.waste_id },
    include: {
      WasteOffer: true
    },
  });

  if (!waste || !user) {
    return NextResponse.json({ error: "Waste o User inexistentes" }, { status: 500 });
  }

  let totalOfferUnit: number = 0;

  // Sumar las unidades de las ofertas existentes
  for (let offer of waste.WasteOffer) {
    totalOfferUnit += parseFloat(offer.units.toString());
  }

  // Sumar las unidades de la nueva oferta
  totalOfferUnit += data.units;

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

  if (user?.companyId !== waste?.companyOwnerId) {
    return NextResponse.json({ error: "Debes pertenecer a la empresa del residuo a ofertar" }, { status: 500 });
  }

  // Crear la oferta
  const offer = await prismaClient.wasteOffer.create({
    data: {
      offerPrice: data.price,
      units: data.units,
      pickupLatitude: data.pickupLatitude,
      pickupLongitude: data.pickupLongitude,
      companySeller: {
        connect: {
          id: user?.companyId
        }
      },
      waste: {
        connect: {
          id: data.waste_id
        }
      }
    }
  });

  if (!offer) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }

  return NextResponse.json("offer created", { status: 201 });
}
