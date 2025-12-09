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

    const trade = await request.json()

    const { data, error } = await supabase
      .from("trade_simulations")
      .insert([
        {
          user_id: user.id,
          analysis_id: trade.analysisId,
          account_balance: trade.accountBalance,
          position_size: trade.positionSize,
          entry_price: trade.entryPrice,
          stop_loss: trade.stopLoss,
          take_profit: trade.takeProfit,
          potential_profit: trade.potentialProfit,
          potential_loss: trade.potentialLoss,
          risk_reward_ratio: trade.riskRewardRatio,
        },
      ])
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({ data: data[0] })
  } catch (error) {
    console.error("[v0] Save trade error:", error)
    return NextResponse.json({ error: "Failed to save trade" }, { status: 500 })
  }
}
