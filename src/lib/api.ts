// =========================================================
// Dashlyze - Centralized API Client
// ---------------------------------------------------------
// CORRECAO: Todas as chamadas agora passam pelo proxy
// /api/proxy/* do Next.js (same-origin). O proxy encaminha
// para o Spring Boot e reescreve os cookies para o dominio
// do Next.js. Isso resolve o problema de cross-origin
// cookies que impedia o middleware de ler dashlyze_token.
// =========================================================

// CORRECAO: Usa o proxy same-origin em vez de chamar o backend diretamente.
// No browser, requests vao para /api/proxy/... (same-origin, cookies funcionam).
// No server (SSR), chama o backend diretamente.
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: usa proxy same-origin
    return "/api/proxy"
  }
  // Server-side: chama backend diretamente
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082"
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "ApiError"
  }
}

// CORRECAO: Refresh agora tambem passa pelo proxy
async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${getBaseUrl()}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
    return res.ok
  } catch {
    return false
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  const res = await fetch(`${getBaseUrl()}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  })

  // Se 401 e nao eh retry, tenta refresh e repete a requisicao
  if (res.status === 401 && !isRetry) {
    const refreshed = await tryRefreshToken()
    if (refreshed) {
      return request<T>(endpoint, options, true)
    }
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    throw new ApiError("Sessao expirada", 401)
  }

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    throw new ApiError("Unauthorized", 401)
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error")
    throw new ApiError(errorText || `HTTP Error ${res.status}`, res.status)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json()
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
}
