// lib/api.ts
function getBaseUrl(): string {
  if (typeof window !== "undefined") return "/api/proxy";
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// Tenta renovar o refresh token
async function tryRefreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${getBaseUrl()}/auth/refresh`, { method: "POST", credentials: "include" });
    return res.ok;
  } catch {
    return false;
  }
}

// Request principal com retry automático
async function request<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${getBaseUrl()}${endpoint}`, { ...options, headers, credentials: "include" });

  if (res.status === 401 && !isRetry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) return request<T>(endpoint, options, true);
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new ApiError("Sessao expirada", 401);
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new ApiError(errorText || `HTTP Error ${res.status}`, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: unknown, onProgress?: ((pct: number) => void) | undefined) => request<T>(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
