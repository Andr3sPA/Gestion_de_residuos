import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { ok, unauthorized } from "../../(utils)/responses";
import { prismaClient } from "@/prisma/client";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) return unauthorized();

  const auctions = await prismaClient.auction.findMany({
    select: {
      createdAt: true,
      status: true,
    },
  });

  return ok({ auctions });
}
