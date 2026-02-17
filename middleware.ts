// =========================================================
// Dashlyze - Next.js Middleware
// ---------------------------------------------------------
// Alteracao: Middleware le o cookie HTTP-only "dashlyze_token"
// setado pelo Spring Boot. Se o token nao existir e a rota
// for protegida, redireciona para /login. Se o usuario ja
// estiver logado e acessar /login ou /register, redireciona
// para /dashboard. Protecao de rotas conforme SecurityConfiguration.
// =========================================================

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Alteracao: Rotas protegidas - exigem ROLE_USER no backend
const protectedRoutes = [
  "/dashboard",
  "/products",
  "/sales",
  "/clients",
  "/analytics",
  "/settings",
]

// Alteracao: Rotas de autenticacao - publicas no backend
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  // Alteracao: Le cookie HTTP-only "dashlyze_token" setado pelo Spring Boot
  const token = request.cookies.get("dashlyze_token")?.value
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  )
  const isAuthRoute = authRoutes.some((route) => pathname === route)

  // Alteracao: Rota protegida sem token -> redireciona para login (401 no backend)
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Alteracao: Usuario logado acessando pagina de auth -> vai para dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
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
    "/login",
    "/register",
  ],
}
