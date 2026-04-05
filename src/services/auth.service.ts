const PROXY_URL = "/api/proxy"

export const authService = {
  login: async (payload: { email: string; password: string }) => {
    const res = await fetch(`${PROXY_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    })

    if (!res.ok) {
      throw new Error("Erro no login")
    }

    return res.json() 
  },

  register: async (payload: any) => {
    const res = await fetch(`${PROXY_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    })

    if (!res.ok) {
      throw new Error("Erro no registro")
    }

    return res.json()
  },

  logout: async () => {
    const res = await fetch(`${PROXY_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })

    if (!res.ok) {
      throw new Error("Erro no logout")
    }
  },

  me: async () => {
    const res = await fetch(`${PROXY_URL}/auth/me`, {
      credentials: "include",
    })

    if (!res.ok) return null

    return res.json()
  },
}