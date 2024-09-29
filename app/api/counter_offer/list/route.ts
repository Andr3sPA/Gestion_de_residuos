import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
    const token = await getToken({ req })

    if (!token) {
        return null
    }
    const user = await prismaClient.user.findUnique({  
        where: {  
          id: token.sub,  
        },  
      })
    
    const counter_offers = await prismaClient.counterOffer.findMany({  
    where: { companyId: user?.companyId },  
    })
    if (!counter_offers) return NextResponse.json({ error: "internal error" }, { status: 500 })
    
    return NextResponse.json(counter_offers, { status: 201 })
}