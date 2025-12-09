import { createClient } from "@/lib/supabase/server"

export async function getBrokerConnections(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("broker_connections")
    .select("id, broker_name, account_number, account_type, is_active, created_at")
    .eq("user_id", userId)

  if (error) throw error
  return data
}

export async function saveBrokerConnection(userId: string, broker: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("broker_connections")
    .insert([{ user_id: userId, ...broker }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBrokerConnection(brokerId: string, updates: any) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("broker_connections").update(updates).eq("id", brokerId).select().single()

  if (error) throw error
  return data
}

export async function deleteBrokerConnection(brokerId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("broker_connections").delete().eq("id", brokerId)

  if (error) throw error
}
