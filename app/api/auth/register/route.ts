// Mock authentication for demo - Replace with real database integration
import { type NextRequest, NextResponse } from "next/server"

const users = new Map()

// Kept for backward compatibility only

export async function POST(request: NextRequest) {
  try {
    const { email, username, password } = await request.json()

    if (users.has(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const user = {
      id: Math.random().toString(),
      email,
      username,
      password, // In production, hash this!
      theme: "system",
      createdAt: new Date(),
    }

    users.set(email, user)

    const response = NextResponse.json({ id: user.id, email, username, theme: user.theme })
    response.cookies.set("auth_token", user.id, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 })
    return response
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

// New function to handle deprecated POST request
export async function DEPRECATED_POST() {
  return NextResponse.json({ error: "Use Supabase Auth directly from the client" }, { status: 400 })
}
