import { NextRequest } from "next/server"

const BACKEND_URL = "http://localhost:8082"

async function handler(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params

  if (!path || path.length === 0) {
    return new Response("Invalid proxy path", { status: 400 })
  }

  const backendUrl =
    `${BACKEND_URL}/${path.join("/")}${req.nextUrl.search}`

  const response = await fetch(backendUrl, {
    method: req.method,
    headers: req.headers,
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.text(),
    credentials: "include",
  })

  const headers = new Headers(response.headers)

  return new Response(response.body, {
    status: response.status,
    headers,
  })
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
}