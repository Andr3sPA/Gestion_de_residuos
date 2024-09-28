import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const companySchema = z.object({
    name: z.string(),
    description: z.string()
  })
export async function POST(req: NextRequest){
    const { success, data } = companySchema.safeParse(await req.json())
    if (!success) return NextResponse.json(null, { status: 400 })
    const company = await prismaClient.company.create({
        data: {
            name: data.name,
            description: data.description

        }
        })
    if (!company) return NextResponse.json({ error: "internal error" }, { status: 500 })

    return NextResponse.json("company created", { status: 201 })        
}