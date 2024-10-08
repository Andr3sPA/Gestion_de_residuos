import { prismaClient } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { unauthorized } from "../../(utils)/responses";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return unauthorized();
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    },
  });

  if (!user) return unauthorized();
  if (!user.companyId)
    return unauthorized("El usuario no pertenece a ninguna empresa");

  const offers = await prismaClient.offer.findMany({
    where: {
      OR: [{ status: "waiting" }, { status: "rejected" }],
      companyBuyerId: user.companyId,
    },
    include: {
      companyBuyer: true,
      auction: {
        include: {
          companySeller: true,
          waste: true,
        },
      },
    },
    orderBy: {
      status: "asc",
    },
  });

  if (!offers)
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  return NextResponse.json({ offers }, { status: 200 });
}