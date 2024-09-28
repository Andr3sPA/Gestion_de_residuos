import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'


export async function POST(req: NextRequest) {
    const session = cookies().get('jwt')?.value
    const payload = await decrypt(session)

    if (!session || !payload) {
        return null
    }
    const user = await prismaClient.user.findUnique({  
        where: {  
          id: payload.id,  
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