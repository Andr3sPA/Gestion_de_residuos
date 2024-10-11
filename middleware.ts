import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { pathStartsWith } from "./app/api/(utils)/paths";
import { unauthorized } from "./app/api/(utils)/responses";

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//
//   if (pathStartsWith(pathname, tokenRequiredPaths)) {
//     const token = await getToken({ req });
//     if (!token || !token.sub) {
//       return unauthorized("Es necesario iniciar sesión");
//     }
//
//     const newReq = req.clone();
//     newReq.headers.append("userId", token.sub);
//     return NextResponse.next({ request: newReq });
//   }
//
//   return NextResponse.next();
// }
//
// const tokenRequiredPaths = ["/api/users/info", "/api/users/list"];
import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Matches the pages config in `[...nextauth]`

  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token?.role === "superAdmin";
      }
      return token !== null;
    },
  },

  pages: {
    signIn: "/",
    error: "/error",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/users/login|api/users/signup|$).*)",
    "/admin",
  ],
};
