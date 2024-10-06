import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { isStrongPassword } from "validator";
import { z } from "zod";
import { badReq } from "../../(utils)/responses";

const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  companyId: z.coerce.number()
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { success, data } = signupSchema.safeParse(body)

  if (!success) return badReq()

  if (!isStrongPassword(data.password, { minLength: 8, minNumbers: 1, minLowercase: 1, minUppercase: 1, minSymbols: 0 })) return NextResponse.json({ error: "La contraseña no cumple con los requisitos mínimos" }, { status: 400 })

  const company = await prismaClient.company.findUnique({ where: { id: data.companyId } })
  if (!company) {
    return NextResponse.json({ error: `La empresa con id '${data.companyId}' no existe` }, { status: 400 })
  }

  const user = await prismaClient.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
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
