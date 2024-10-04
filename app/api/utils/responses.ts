import { error } from "console";
import { NextResponse } from "next/server";

const commonResponse = (ok: boolean, status: number, error?: string, extras?: { [key: string]: any }) => {
  return NextResponse.json({ ok, error, ...extras }, { status })
}

export const badReq = (reason?: string) => commonResponse(false, 400, reason ?? "Petición inválida")
export const notAuthorized = (reason?: string) => commonResponse(false, 401, reason ?? "Credenciales no válidas")
export const internal = (reason?: string) => commonResponse(false, 500, reason ?? "Error interno del servidor")

export const ok = (data?: { [key: string]: any }) => commonResponse(true, 200, undefined, data)
