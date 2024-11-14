import { prismaClient } from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import {
  unauthorized,
  forbidden,
  ok,
  badReq,
  alreadyExists,
  created,
} from "../../(utils)/responses";
import { JWTWithRole } from "../../auth/[...nextauth]/route";

async function listAll(req: NextRequest) {
  const token = (await getToken({ req })) as JWTWithRole;
  if (!token || !token.sub) return unauthorized();

  const types = await prismaClient.wasteType.findMany();

  return ok({ types });
}

async function create(req: NextRequest) {
  const token = (await getToken({ req })) as JWTWithRole;
  if (!token || !token.sub) return unauthorized();
  if (token.role !== "superAdmin") return forbidden();

  const body = await req.json();
  if (!body.name) return badReq();

  const typeExists =
    (await prismaClient.wasteType.count({
      where: {
        name: body.name,
      },
    })) > 0;

  if (typeExists) return alreadyExists();

  const newType = await prismaClient.wasteType.create({
    data: {
      name: body.name,
      emissionFactor: body.emissionFactor,
    },
  });

  if (newType) return created(newType);
}

export { listAll as GET, create as POST };
