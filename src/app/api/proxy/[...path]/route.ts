import { NextRequest } from "next/server";

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function handler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  if (!path || path.length === 0) {
    return new Response("Invalid proxy path", { status: 400 });
  }

  const backendUrl = `${BACKEND_URL}/${path.join("/")}${req.nextUrl.search}`;

  try {
    // Encaminha a requisição mantendo headers, cookies e corpo
    const init: any = {
      method: req.method,
      headers: req.headers,
      body: req.body,          // funciona para FormData / uploads
      // duplex é suportado em runtime, mas TS reclama, então usamos any
      duplex: "half",
    };

    const response = await fetch(backendUrl, init);

    // Replicamos headers e status
    const headers = new Headers(response.headers);

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (err) {
    console.error("Proxy fetch error:", err);
    return new Response("Backend unreachable", { status: 502 });
  }
}

// Mapeia todos os métodos HTTP
export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };