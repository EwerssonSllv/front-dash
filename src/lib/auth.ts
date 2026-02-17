// =========================================================
// Dashlyze - Auth Utilities (Server-side)
// ---------------------------------------------------------
// Alteracao: Mantido verificacao via cookie HTTP-only
// "dashlyze_token". O token e setado pelo Spring Boot
// diretamente. Estas funcoes sao usadas no middleware
// e em Server Components para verificar autenticacao.
// =========================================================

import { cookies } from "next/headers"

const TOKEN_KEY = "dashlyze_token"

// Alteracao: Retorna o token do cookie (usado apenas server-side)
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_KEY)?.value || null
}

// Alteracao: Verifica se o usuario esta autenticado
export async function isAuthenticated(): Promise<boolean> {
  const token = await getServerToken()
  return !!token
}
