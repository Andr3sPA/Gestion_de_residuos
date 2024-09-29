import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function GET(req: NextRequest) {
    const token = await getToken({ req })
    if (!token ) {
        return null
    }
    const user = await prismaClient.user.findUnique({  
        where: {  
          id: token.sub,  
        },  
      })
    
    const wastes = await prismaClient.waste.findMany({  
    where: { companyOwnerId: user?.companyId },  
    })
    if (!wastes) return NextResponse.json({ error: "internal error" }, { status: 500 })
    return NextResponse.json(wastes, { status: 201 })
}