import { prismaClient } from "@/prisma/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { badReq, ok } from "../../utils/responses";

// Define a schema to validate the login request
const loginReqSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Handle POST requests for user login
export async function POST(req: NextRequest) {
  // Validate the incoming request data
  const { success: isValid, data } = loginReqSchema.safeParse(await req.json());

  if (!data || !isValid) return badReq("Error al validar los datos");

  // Find user by email
  const user = await prismaClient.user.findUnique({
    where: {
      email: data.email
    }
  });

  // Return error if user is not found
  if (!user) return badReq("Email o contraseña incorrectos");

  // Compare the provided password with the stored hash
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) return badReq("Email o contraseña incorrectos");

  // Return user data and a success response
  return ok({
    user: {
      id: user.id,
      email: user.email,
      role:user.role
    }
  })
}
