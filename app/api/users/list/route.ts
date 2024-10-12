import { prismaClient } from "@/prisma/client";
import { NextRequest } from "next/server";
import { forbidden, ok, unauthorized } from "../../(utils)/responses";
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
  });

  if (!user) return unauthorized();
  if (user.role === "companyManager") return forbidden();
  if (user.role === "companyAdmin" && user.membershipStatus !== "accepted")
    return forbidden();

  let users;
  if (user.role === "companyAdmin") {
    users = await prismaClient.user.findMany({
      where: {
        companyId: user.companyId,
      },
    });
  } else {
    users = await prismaClient.user.findMany();
  }

  return ok(users);
}
