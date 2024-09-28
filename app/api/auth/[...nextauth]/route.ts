import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      // Attach the user id to the session
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.email=token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email=user.email;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Realizar la solicitud a la API para validar las credenciales
        const res = await fetch("http://localhost:3000/api/users/login", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();
        const user=data.user;
        if (data.ok && user) {
          return user;
        }

        return null;
      }
    })
  ],
  pages: {
    error: '/auth/error', // Página de error
  }
});

// Exportar las funciones del manejador para solicitudes GET y POST
export { handler as GET, handler as POST };

