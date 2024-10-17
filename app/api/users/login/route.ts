import { prismaClient } from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { badReq, ok, unauthorized } from "../../(utils)/responses";

// Define a schema to validate the login request
const loginReqSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Handle POST requests for user login
export async function POST(req: NextRequest) {
  z;
  // Validate the incoming request data
  const { success: isValid, data } = loginReqSchema.safeParse(await req.json());

  if (!data || !isValid) return badReq("Error al validar los datos");

  // Find user by email
  const user = await prismaClient.user.findUnique({
    where: {
      email: data.email,
    },
  });

  // Return error if user is not found
  if (!user) return badReq("Email o contraseña incorrectos");

  // Compare the provided password with the stored hash
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) return badReq("Email o contraseña incorrectos");

  if (user.membershipStatus === "rejected")
    return unauthorized(
      "Su solicitud de registro ha sido rechazada, contacte con el administrador.",
    );
  if (user.membershipStatus === "waiting")
    return unauthorized(
      "Su solicitud de registro aún está en espera de aprobación, inténtelo más tarde.",
    );

  // Return user data and a success response
  return ok({
    user: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    },
  });
}
