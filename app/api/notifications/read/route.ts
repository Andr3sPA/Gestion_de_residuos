import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
const notificationSchema = z.object({
    id: z.number(),
  })
export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const { success, data, error } = notificationSchema.safeParse(await req.json())
  if (!success) {
    // Imprime los errores en la consola
    console.error("Errores de validación:", error.errors);
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }
  const notification = await prismaClient.notification.update({
    where: {
      id: data.id,
    },
    data: {
      read: true,
    },
  })

  if (!notification)
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  return NextResponse.json({ status: 201 });
}