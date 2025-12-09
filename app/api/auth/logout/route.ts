import { NextResponse } from "next/server"

// Kept for backward compatibility only

export async function POST() {
  return NextResponse.json({ error: "Use Supabase Auth directly from the client" }, { status: 400 })
}
