
export function pathStartsWith(pathname: string, anyOf: string | string[]): boolean {
  if (typeof anyOf === "string") {
    return pathname.startsWith(anyOf)
  }
  return anyOf.map((p) => pathname.startsWith(p)).reduce((a, b) => a || b)
}
