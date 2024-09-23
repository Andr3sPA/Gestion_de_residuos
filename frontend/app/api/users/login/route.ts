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

  if (!data || !isValid) return errorRes()
  const user = await prismaClient.user.findUnique({
    where: {
      email: data.email
    }
  })

  console.log(cookies().get("jwt"))

  if (!user) return errorRes()

  if (await bcrypt.compare(data.password, user.password)) {
    const jwt = await new SignJWT({
      id: user.id,
      username: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: "Default"
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

    return NextResponse.json({ data }, { status: 200 })
  }

  return NextResponse.json({ data, error: "incorrect email or password" }, { status: 400 })
}

const errorRes = () => {
  return NextResponse.json({ error: "invalid request" }, { status: 400 })
}


