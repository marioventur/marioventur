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

    const analysis = await request.json()

    const { data, error } = await supabase
      .from("analysis_history")
      .insert([
        {
          user_id: user.id,
          pair_name: analysis.pair,
          timeframe: analysis.timeframe,
          signal: analysis.signal,
          confidence: analysis.confidence,
          entry_price: analysis.entryPrice,
          stop_loss: analysis.stopLoss,
          take_profit: analysis.takeProfit,
          risk_percentage: analysis.riskPercentage,
          reward_percentage: analysis.rewardPercentage,
          analysis_text: analysis.analysis,
          indicators: analysis.indicators,
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data[0] })
  } catch (error) {
    console.error("[v0] Save analysis error:", error)
    return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
  }
}
