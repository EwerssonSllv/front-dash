// app/api/proxy/[...proxy]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

async function proxyRequest(request: NextRequest, method: string) {
  try {
    const url = new URL(request.url);
    const backendPath = url.pathname.replace("/api/proxy", "");
    const backendUrl = `${BACKEND_URL}${backendPath}${url.search}`;

    // Copia headers do request, menos host/content-length
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("content-length");

    // Pega body para métodos que não sejam GET ou HEAD
    let body: string | undefined;
    if (method !== "GET" && method !== "HEAD") {
      body = await request.text();
    }

    // Chamada para o backend
    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body,
      redirect: "manual",
      credentials: "include",
    });

    // Caso 204 No Content
    if (backendResponse.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Lê resposta
    const contentType = backendResponse.headers.get("content-type");
    const text = await backendResponse.text();
    const response = contentType?.includes("application/json")
      ? NextResponse.json(text ? JSON.parse(text) : null, { status: backendResponse.status })
      : new NextResponse(text || null, { status: backendResponse.status });

    // Copia cookies do backend para o cliente
    const setCookies = backendResponse.headers.get("set-cookie");
    if (setCookies) {
      setCookies.split(/,(?=[^ ;]+=)/).forEach(cookie => {
        response.headers.append("set-cookie", cookie.trim());
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal proxy error" }, { status: 500 });
  }
}

// Exporta métodos HTTP
export const GET = (req: NextRequest) => proxyRequest(req, "GET");
export const POST = (req: NextRequest) => proxyRequest(req, "POST");
export const PUT = (req: NextRequest) => proxyRequest(req, "PUT");
export const DELETE = (req: NextRequest) => proxyRequest(req, "DELETE");
export const PATCH = (req: NextRequest) => proxyRequest(req, "PATCH");
