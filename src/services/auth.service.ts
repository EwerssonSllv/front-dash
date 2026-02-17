// =========================================================
// Dashlyze - Auth Service
// ---------------------------------------------------------
// Alteracao: Adicionado credentials: 'include' em todas as
// chamadas para que o Spring Boot leia/escreva o cookie
// HTTP-only "dashlyze_token" diretamente.
// Adicionado endpoints: refresh() e logout().
// Register agora retorna AuthResponse (login automatico).
// =========================================================

import type { LoginPayload, RegisterPayload, AuthResponse } from "../lib/types"

// CORRECAO: Usa proxy same-origin para que cookies funcionem
const PROXY_URL = "/api/proxy"

export const authService = {
  async login(payload: LoginPayload): Promise<void> {
    const res = await fetch("/api/proxy/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const msg = await res.text()
      throw new Error(msg || "Erro no login")
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await fetch(`${PROXY_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    })
    if (!res.ok) {
      const msg = await res.text().catch(() => "Erro ao registrar")
      throw new Error(msg || "Erro ao criar conta")
    }
    return res.json()
  },

  async refresh(): Promise<boolean> {
    try {
      const res = await fetch(`${PROXY_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })
      return res.ok
    } catch {
      return false
    }
  },

  async logout(): Promise<void> {
    await fetch(`${PROXY_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
  },
}