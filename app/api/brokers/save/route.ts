import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const broker = await request.json()

    const { data, error } = await supabase
      .from("broker_connections")
      .insert([
        {
          user_id: user.id,
          broker_name: broker.brokerName,
          account_number: broker.accountNumber,
          account_type: broker.accountType,
          api_key: broker.apiKey,
          api_secret: broker.apiSecret,
          is_active: broker.isActive ?? true,
        },
      ])
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({ data: data[0] })
  } catch (error) {
    console.error("[v0] Save broker error:", error)
    return NextResponse.json({ error: "Failed to save broker" }, { status: 500 })
  }
}
