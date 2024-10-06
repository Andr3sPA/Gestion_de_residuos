import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { unauthorized } from "../../(utils)/responses";
import { z } from "zod";

// Validamos que el recordType sea uno de los valores permitidos
const purchaseSchema = z.object({
  recordType: z.enum(["Ventas", "Compras"]),
});

// Endpoint para obtener las compras o ventas
export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.sub) return unauthorized();

  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    },
  });

  if (!user) return unauthorized();
  if (!user.companyId) return unauthorized("No pertenece a ninguna empresa");

  // Parseamos y validamos el parámetro desde la query
  const { searchParams } = new URL(req.url);
  const recordType = searchParams.get("recordType") as "Ventas" | "Compras";

  // Validación del tipo de recordType usando zod
  const { success, error } = purchaseSchema.safeParse({ recordType });

  if (!success) {
    return NextResponse.json({ error: error?.issues }, { status: 400 });
  }

  let purchases;

  if (recordType === "Ventas") {
    purchases = await prismaClient.purchase.findMany({
      where: {
        auction: {
          companySellerId: user.companyId,
        },
      },
      include: {
        auction: {
        include:{
            companySeller:true,
            waste:{
              include:{
                unitType:true,
                wasteType:true
              }
            }
        }

        },

        offer: {
          include:{
              companyBuyer:true
          }
  
          }
      },
    });
  } else if (recordType === "Compras") {
    purchases = await prismaClient.purchase.findMany({
      where: {
        offer: {
          companyBuyerId: user.companyId,
        },
      },
      include: {
        auction: {
          include:{
            companySeller:true,
            waste:{
              include:{
                unitType:true,
                wasteType:true
              }
            }
        },

        },

        offer: {
          include:{
              companyBuyer:true
          },
  
          }
      },
    });
  }
  console.log(purchases)
  // Verificamos si hay resultados
  if (!purchases) {
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }

  return NextResponse.json(purchases, { status: 200 });
}
