import { prismaClient } from "@/prisma/client";
import { ok } from "../../(utils)/responses";

export async function GET() {
  const all = await prismaClient.company.findMany();

  return ok({ companies: all });
}
