import { prismaClient } from "@/prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginReqSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function POST(req: NextRequest) {

  let { success: isValid, data } = loginReqSchema.safeParse(await req.json())

  if (!data || !isValid) return errorRes("Error al validar los datos")
  const user = await prismaClient.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (!user) return errorRes("Email o contraseña incorrectos")

  if (await bcrypt.compare(data.password, user.password)) {
    const jwt = await new SignJWT({
      id: user.id,
      username: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role
    }).setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(encodedKey)

    cookies().set("jwt", jwt, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1 * 3600 * 1000),
      sameSite: 'lax',
      path: '/',
    })

    return NextResponse.json({ userId: user.id, username: `${user.firstName} ${user.lastName}`, email: user.email }, { status: 200 })
  }

  return NextResponse.json({ data, error: "Email o contraseña incorrectos" }, { status: 400 })
}

const errorRes = (reason?: string) => {
  return NextResponse.json({ error: reason ?? "Petición inválida" }, { status: 400 })
}


