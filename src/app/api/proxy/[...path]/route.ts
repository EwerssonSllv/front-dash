import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082"

async function proxyRequest(request: NextRequest, method: string) {
  const url = new URL(request.url)
  const backendPath = url.pathname.replace("/api/proxy", "")
  const backendUrl = `${BACKEND_URL}${backendPath}${url.search}`

  // 🔥 Copia TODOS os headers originais
  const headers = new Headers(request.headers)

  // Remove host para evitar conflito
  headers.delete("host")

  let body: string | undefined

  if (method !== "GET" && method !== "HEAD") {
    body = await request.text()
  }

  const backendResponse = await fetch(backendUrl, {
    method,
    headers,
    body,
  })

  // 🔥 Se backend retornar erro, tenta devolver JSON
  const contentType = backendResponse.headers.get("content-type")

  if (contentType?.includes("application/json")) {
    const data = await backendResponse.json()

    const response = NextResponse.json(data, {
      status: backendResponse.status,
    })

    // Copia cookies corretamente
    const setCookie = backendResponse.headers.get("set-cookie")
    if (setCookie) {
      response.headers.set("set-cookie", setCookie)
    }

    return response
  } else {
    // Se não for JSON, devolve texto simples
    const text = await backendResponse.text()

    return new NextResponse(text, {
      status: backendResponse.status,
    })
  }
}

export const GET = (req: NextRequest) => proxyRequest(req, "GET")
export const POST = (req: NextRequest) => proxyRequest(req, "POST")
export const PUT = (req: NextRequest) => proxyRequest(req, "PUT")
export const DELETE = (req: NextRequest) => proxyRequest(req, "DELETE")
export const PATCH = (req: NextRequest) => proxyRequest(req, "PATCH")
