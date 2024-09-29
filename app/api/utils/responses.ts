import { NextResponse } from "next/server";

const commonResponse = (ok: boolean, status: number, extras?: { [key: string]: any }) => {
  return NextResponse.json({ ok, ...extras }, { status })
}

export const badReq = (reason?: string) => commonResponse(false, 400, { error: reason ?? "Petición inválida" })
export const internal = (reason?: string) => commonResponse(false, 500, { error: reason ?? "Error interno del servidor" })

export const ok = (data?: { [key: string]: any }) => commonResponse(true, 200, data)
