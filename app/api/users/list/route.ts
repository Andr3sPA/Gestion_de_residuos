import { prismaClient } from "@/prisma/client";
import { NextRequest } from "next/server";
import { forbidden, ok, unauthorized } from "../../(utils)/responses";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("userId") as string;

  const user = await prismaClient.user.findUnique({
    where: {
      id: parseInt(userId),
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
        membershipStatus: "waiting",
      },
    });
  } else {
    users = await prismaClient.user.findMany({
      where: {
        membershipStatus: "waiting",
      },
    });
  }

  return ok(users);
}
