import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { pathStartsWith } from "./app/api/(utils)/paths";
import { unauthorized } from "./app/api/(utils)/responses";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathStartsWith(pathname, tokenRequiredPaths)) {

    const token = await getToken({ req })
    if (!token || !token.sub) {
      return unauthorized("Es necesario iniciar sesión")
    }

    const newReq = req.clone()
    newReq.headers.append("userId", token.sub)
    return NextResponse.next({ request: newReq })
  }

  return NextResponse.next()
}

const tokenRequiredPaths = ["/api/users/info", "/api/users/list"]
