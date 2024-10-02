import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req })

    if (!token) {
        return NextResponse.json({ error: "No hay token de sesión" }, { status: 500 });
    }

    const user = await prismaClient.user.findUnique({  
        where: {  
          id: token.sub,  
        }
      })
    
    const offers = await prismaClient.wasteOffer.findMany({  
    where: { companySellerId: user?.companyId },
    include: {
      companySeller: true,
      waste:true,
    }   
    })
    if (!offers) return NextResponse.json({ error: "internal error" }, { status: 500 })
    console.log(offers)
    return NextResponse.json(offers, { status: 201 })
}