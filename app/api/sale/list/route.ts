import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function GET(req: NextRequest) {
    const token = await getToken({ req })

    if (!token) {
        return null
    }
    const user = await prismaClient.user.findUnique({  
        where: {  
          id: token.sub,  
        },  
      })
    

    const sales = await prismaClient.sale.findMany({
    where: {
        OR: [
        {
            offer: {
            companySeller: {
                id: user.companyId,
            },
            },
        },
        {
            counterOffer: {
            companyBuyer: {
                id: user.companyId,
            },
            },
        },
        ],
    },
    include: {
        offer: true,
        counterOffer: true,
    },
    });

    if (!sales) return NextResponse.json({ error: "internal error" }, { status: 500 })
    
    return NextResponse.json(sales, { status: 201 })
}