import { Session } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { useEffect } from "react";

interface UserSession extends Session {
  user?: {
    id?: string | null;
    email?: string | null;
    name?: string | null;
  }
}

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      // Attach the user id to the session
      const sessionWithUser: UserSession = session
      if (token?.sub) {
        sessionWithUser.user = {
          id: token.sub,
          email: token.email,
          name: token.name
        }
      }
      return sessionWithUser;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name
        //TODO: set issuer and rest
      }
      return token;
    },
  },
  //TODO: use middleware or component to redirect if login failed or no logged in
  providers: [CredentialsProvider({
    name: 'Credentials',
    credentials: {
      username: { label: "Email", type: "text", placeholder: "jsmith@mail.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // Realizar la solicitud a la API para validar las credenciales
      const res = await fetch("/api/users/login", {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      const user = data.user;
      if (data.ok && user) {
        return user;
      }

      return null;
    }
  })
  ],
  pages: {
    error: '', // Página de error
  }
});

// Exportar las funciones del manejador para solicitudes GET y POST
export { handler as GET, handler as POST };
