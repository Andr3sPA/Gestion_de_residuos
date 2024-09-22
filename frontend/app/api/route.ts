import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET() {
  const user = await prisma.user.findMany()
  return NextResponse.json(user)
}

export async function POST() {
  const user = await prisma.user.create({
    data: {
      name: "andres",
      email: "andres.pena2@udea.edu.co"
    }
  })

  return NextResponse.json(user, { status: 201 })
}
