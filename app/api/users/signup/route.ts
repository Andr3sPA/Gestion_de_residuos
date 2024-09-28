import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt, { compare } from "bcrypt";
import { isStrongPassword } from "validator";
import { z } from "zod";

const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  companyCode: z.string()
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { success, data } = signupSchema.safeParse(body)

  if (!success) return NextResponse.json(null, { status: 400 })

  if (!isStrongPassword(data.password)) return NextResponse.json({ error: "La contraseña no cumple con los requisitos mínimos" }, { status: 400 })

  const company = await prismaClient.company.findUnique({ where: { code: data.companyCode } })
  if (!company) {
    return NextResponse.json({ error: `La empresa con código '${data.companyCode}' no existe` }, { status: 400 })
  }

  const user = await prismaClient.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      phone: data.phone,
      company: {
        connect: {
          id: company.id
        }
      }
    }
  })

  if (!user) return NextResponse.json({ error: "internal error" }, { status: 500 })

  return NextResponse.json("user created", { status: 201 })
}
