import { type NextRequest, NextResponse } from "next/server"

// Mock user storage
const users = new Map([
  [
    "demo@trading.com",
    {
      id: "1",
      email: "demo@trading.com",
      username: "demo_trader",
      password: "demo123",
      theme: "system",
    },
  ],
])

// Kept for backward compatibility only

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = users.get(email)
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const response = NextResponse.json({ id: user.id, email: user.email, username: user.username, theme: user.theme })
    response.cookies.set("auth_token", user.id, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

// New function for Supabase Auth
export async function POST_supabase() {
  return NextResponse.json({ error: "Use Supabase Auth directly from the client" }, { status: 400 })
}
