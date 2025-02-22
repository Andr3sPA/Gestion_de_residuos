import { User } from "@prisma/client";
import axios from "axios";
import { Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export interface UserSession extends Session {
  user?: {
    id?: string | null;
    email?: string | null;
    name?: string | null;
    role?: string | null;
  };
}

export interface JWTWithRole extends JWT {
  role?: string | null;
}

export interface UserWithRole extends AdapterUser {
  role?: string | null;
  error?: string | null;
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: UserSession;
      token: JWTWithRole;
    }) {
      // Attach the user id to the session
      const sessionWithUser: UserSession = session;

      if (token?.sub) {
        sessionWithUser.user = {
          id: token.sub,
          email: token.email,
          name: token.name,
          role: token.role,
        };
      }
      return sessionWithUser;
    },
    async jwt({ token, user }: { token: JWTWithRole; user: any }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        //TODO: set issuer and rest
      }
      return token;
    },
    async signIn({ user }) {
      const userWithRole = user as UserWithRole;
      if (userWithRole.error) {
        throw new Error(userWithRole.error);
      }
      return true;
    },
  },
  //TODO: use middleware or component to redirect if login failed or no logged in
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Realizar la solicitud a la API para validar las credenciales
        try {
          const res = await axios.post(
            process.env.NEXTAUTH_URL + "/api/users/login",
            credentials,
          );

          const data = res.data;
          const user = data.user;
          if (user) {
            return user;
          }
        } catch (err: any) {
          if (err.response && err.response.data.error) {
            return { error: err.response.data.error };
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    error: "", // Página de error
  },
});

// Exportar las funciones del manejador para solicitudes GET y POST
export { handler as GET, handler as POST };
