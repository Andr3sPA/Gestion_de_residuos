import { NextRequest } from "next/server";
import {
  badReq,
  forbidden,
  internal,
  notFound,
  ok,
  unauthorized,
} from "../../(utils)/responses";
import { prismaClient } from "@/prisma/client";
import { z } from "zod";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) {
    return unauthorized("Es necesario iniciar sesión");
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    },
    select: {
      id: true,
      company: {
        select: {
          name: true,
          description: true,
          address: true,
          nit: true,
          phoneNumber: true,
        },
      },
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      membershipStatus: true,
    },
  });

  if (!user) return notFound("Usuario no encontrado");

  return ok(user);
}

const membershipUpdateSchema = z.object({
  id: z.coerce.number(),
  status: z.enum(["accepted", "rejected"]),
});

// accept/reject membership
export async function PATCH(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.sub) {
    return unauthorized("Es necesario iniciar sesión");
  }

  const body = await req.json();
  const { success, data } = membershipUpdateSchema.safeParse(body);

  if (!success) return badReq();
  if (parseInt(token.sub) === data.id) return forbidden();

  const userAdmin = await prismaClient.user.findUnique({
    where: {
      id: parseInt(token.sub),
    },
  });

  if (!userAdmin) internal();

  const userToUpdate = await prismaClient.user.update({
    where: {
      id: data.id,
    },
    data: {
      membershipStatus: data.status,
    },
  });

  if (userToUpdate) return ok();
  return internal();
}
