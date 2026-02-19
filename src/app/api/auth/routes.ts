import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const TOKEN_KEY = "access_token"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_KEY)?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_KEY)

  return NextResponse.json({ success: true })
}
