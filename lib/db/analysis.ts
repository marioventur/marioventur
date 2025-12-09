import { createClient } from "@/lib/supabase/server"

export async function getAnalysisHistory(userId: string, limit = 50) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("analysis_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function saveAnalysis(userId: string, analysis: any) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("analysis_history")
    .insert([{ user_id: userId, ...analysis }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAnalysis(analysisId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("analysis_history").delete().eq("id", analysisId)

  if (error) throw error
}
