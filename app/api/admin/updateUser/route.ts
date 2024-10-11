import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
const userSchema = z.object({
    id: z.number(),
    membershipStatus: z.enum(["accepted", "rejected"]), 
    role: z.enum(["companyManager", "companyAdmin", "superAdmin"]),
  });
export async function POST(req: NextRequest) {
    const token = await getToken({ req });
    if (!token || token.role !== "superAdmin") return NextResponse.json({ error: "No tienes permisos para realizar esta acción" }, { status: 401 });
    const { success, data,error } = userSchema.safeParse(await req.json());
    if (!success) {
        // Imprime los errores en la consola
        console.error("Errores de validación:", error.errors);
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      const user = await prismaClient.user.findUnique({
        where: {
          id: data.id,
        },
      })
      if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
      await prismaClient.user.update({
        where: {
          id: data.id,
        },
        data: {
          membershipStatus: data.membershipStatus,
          role: data.role,
        },
      })
      return NextResponse.json({ message:"Usuario modificado satisfactoriamente"}, { status: 201 });
}
