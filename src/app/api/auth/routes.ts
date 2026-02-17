// =========================================================
// Dashlyze - Auth Status Check (Next.js API Route)
// ---------------------------------------------------------
// Endpoint simples para verificar se o usuario esta logado.
// O proxy /api/proxy/[...path] cuida de login/register/
// refresh/logout. Esta rota so verifica a presenca do cookie.
// =========================================================

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const TOKEN_KEY = "access_token"

// GET: Verifica se o cookie dashlyze_token existe
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_KEY)?.value
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true })
}

// DELETE: Remove o cookie localmente como fallback
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_KEY)
  return NextResponse.json({ success: true })
}
