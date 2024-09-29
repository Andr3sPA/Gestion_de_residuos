import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";


const offerSchema = z.object({
    offer_id: z.number(),
    counter_offer_id: z.number(),
    status:z.string()
})

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
    const { success, data } = offerSchema.safeParse(await req.json())

    if (!token) {
        return null
    }


    const user = await prismaClient.user.findUnique({
        where: { id: token.sub }, // Usamos el userId convertido a string
    });
    const offer = await prismaClient.offer.findUnique({
        where: { id: data?.offer_id }, // Usamos el userId convertido a string
    });
    const counter_offer = await prismaClient.counterOffer.findUnique({
        where: { id: data?.counter_offer_id }, // Usamos el userId convertido a string
    });
    if (user?.companyId!=offer?.companyId) return NextResponse.json({ error: "You are not part of the sellers company" }, { status: 500 })

    if (!success) return NextResponse.json(null, { status: 400 })

    if(data.status=="rejected"){

          const counterOffer = await prismaClient.counterOffer.update({  
            data: {  
              status: 'rejected',  
            },  
            where: {  
              id: data.counter_offer_id,  
            },  
          })
          console.log(counterOffer)
          return NextResponse.json("counter offer rejected", { status: 201 })
    }    
    else if(data.status=="accepted"){
        const counterOffer = await prismaClient.counterOffer.update({  
            data: {  
              status: 'accepted',  
            },  
            where: {  
              id: data.counter_offer_id,  
            },  
          })
          const offer = await prismaClient.offer.update({  
            data: {  
              status: 'sold',  
            },  
            where: {  
              id: data.offer_id,  
            },  
          })

        const sale = await prismaClient.sale.create({
            data: {
                price:counter_offer.price,
                counterOffer: {
                    connect: {
                        id: data.counter_offer_id
                    }
                },
                offer: {
                    connect: {
                        id: data.offer_id
                    }
                }
            }
        })

        if (!sale) return NextResponse.json({ error: "internal error" }, { status: 500 })
        
        return NextResponse.json("counter offer accepted", { status: 201 })
}
}
