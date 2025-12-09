import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { theme } = await request.json()
    // In production, update user in database
    return NextResponse.json({ success: true, theme })
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
