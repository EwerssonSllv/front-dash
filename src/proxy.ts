import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = [
  "/dashboard",
  "/products",
  "/sales",
  "/clients",
  "/analytics",
  "/settings",
]

export function proxy(request: NextRequest) {

  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  if (!isProtected) return NextResponse.next()

  // Apenas verifica se existe refresh_token
  const refresh = request.cookies.get("refresh_token")

  if (!refresh) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/sales/:path*",
    "/clients/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
}