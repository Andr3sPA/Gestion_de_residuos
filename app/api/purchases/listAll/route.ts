import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { ok, unauthorized } from "../../(utils)/responses";
import { prismaClient } from "@/prisma/client";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) return unauthorized();

  const purchases = await prismaClient.purchase.findMany({
    select: {
      id: true,
      finalPrice: true,
      createdAt: true,
    },
  });

  return ok({ purchases });
}
