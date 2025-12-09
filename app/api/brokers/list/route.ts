import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("broker_connections")
      .select("id, broker_name, account_number, account_type, is_active, created_at")
      .eq("user_id", user.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] Fetch brokers error:", error)
    return NextResponse.json({ error: "Failed to fetch brokers" }, { status: 500 })
  }
}
