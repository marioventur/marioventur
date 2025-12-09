import { createClient as createServerClient } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/client"

// Server-side profile operations
export async function getProfile(userId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: any) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) throw error
  return data
}

// Client-side profile creation (called from auth-context)
export async function createProfileClient(userId: string, email: string, fullName?: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("profiles")
    .insert([{ id: userId, email, full_name: fullName }])
    .select()
    .single()

  if (error) throw error
  return data
}

// Keep server version for API routes
export async function createProfile(userId: string, email: string, fullName?: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("profiles")
    .insert([{ id: userId, email, full_name: fullName }])
    .select()
    .single()

  if (error) throw error
  return data
}
