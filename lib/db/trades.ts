import { createClient } from "@/lib/supabase/server"

export async function getTradeSimulations(userId: string, limit = 50) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("trade_simulations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function saveTradeSimulation(userId: string, trade: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("trade_simulations")
    .insert([{ user_id: userId, ...trade }])
    .select()
    .single()

  if (error) throw error
  return data
}
