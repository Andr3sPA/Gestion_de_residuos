import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { isStrongPassword } from "validator";
import { z } from "zod";

const signupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  age: z.number().positive().min(12 + 1),
  email: z.string().email(),
  password: z.string() //TODO: regex this
})


export async function GET(req: NextRequest) {
  const company = await prismaClient.company.create({
    data: {
      name: "Exito",
      description: "noc"
    },
  });
  return NextResponse.json(null, { status: 201 })
}

export async function POST(req: NextRequest) {
  const { success, data } = signupSchema.safeParse(await req.json())

  if (!success) return NextResponse.json(null, { status: 400 })

  // if (!isStrongPassword(data.password)) return NextResponse.json({ error: "password not strong enough" }, { status: 400 })

  const user = await prismaClient.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      company: {
        connect: {
          id: 1
        }
      }
    }
  })

  if (!user) return NextResponse.json({ error: "internal error" }, { status: 500 })

  return NextResponse.json("user created", { status: 201 })
}
