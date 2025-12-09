import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Mock user data - In production, look up from database
  return NextResponse.json({
    id: token,
    email: "demo@trading.com",
    username: "demo_trader",
    theme: "system",
  })
}
