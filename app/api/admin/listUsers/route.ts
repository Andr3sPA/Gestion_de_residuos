import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || token.role !== "superAdmin")
    return NextResponse.json(
      { error: "No tienes permisos para realizar esta acción" },
      { status: 401 },
    );

  const users = await prismaClient.user.findMany({
    orderBy: {
      membershipStatus: "desc",
    },
    where: {
      id: {
        not: Number(token.sub),
      },
    },
    include: {
      company: true,
    },
  });
  return NextResponse.json(users, { status: 201 });
}
const userSchema = z.object({
  id: z.number(),
  membershipStatus: z.enum(["accepted", "rejected"]),
  role: z.enum(["companyManager", "companyAdmin", "superAdmin"]),
});
