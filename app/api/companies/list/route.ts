import { prismaClient } from "@/prisma/client";
import { ok } from "../../(utils)/responses";

export async function GET() {
  const all = await prismaClient.company.findMany({
    select: {
      id: true,
      name: true,
    }
  })

  return ok({ companies: all })
}
