import { prismaClient } from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  unauthorized,
  forbidden,
  badReq,
  internal,
  created,
  alreadyExists,
} from "../../(utils)/responses";
import { JWTWithRole } from "../../auth/[...nextauth]/route";
const companySchema = z.object({
  name: z.string(),
  address: z.string(),
  phoneNumber: z.string().optional(),
  description: z.string(),
  nit: z.string().regex(/\b[0-9]{3}\.[0-9]{3}\.[0-9]{3}\.[0-9]\b/), // NNN.NNN.NNN.N
});

// registers a new company from the request
export async function POST(req: NextRequest) {
  const token = (await getToken({ req })) as JWTWithRole;
  if (!token || !token.sub) return unauthorized();
  if (token.role !== "superAdmin") return forbidden();

  const { success, data, error } = companySchema.safeParse(await req.json());
  if (!success) return badReq(error.message);

  if (
    (await prismaClient.company.count({
      where: {
        name: data.name,
      },
    })) > 0
  ) {
    return alreadyExists();
  }

  const company = await prismaClient.company.create({
    data,
  });

  if (!company) return internal();

  return created(company);
}
