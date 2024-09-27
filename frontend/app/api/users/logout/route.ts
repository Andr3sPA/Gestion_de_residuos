import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function POST() {
  cookies().delete("jwt")
  return NextResponse.json({}, { status: 200 })
}
