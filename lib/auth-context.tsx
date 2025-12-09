"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { createProfileClient } from "@/lib/db/profiles"

interface UserData extends User {
  theme?: "light" | "dark" | "system"
}

interface AuthContextType {
  user: UserData | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateTheme: (theme: "light" | "dark" | "system") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()

        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser({
            ...session.user,
            theme: (session.user.user_metadata?.theme as any) || "dark",
          })
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("[v0] Auth check failed:", err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          ...session.user,
          theme: (session.user.user_metadata?.theme as any) || "dark",
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (data.user) {
        setUser({
          ...data.user,
          theme: (data.user.user_metadata?.theme as any) || "dark",
        })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login failed"
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            theme: "dark",
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data.user) {
        try {
          await createProfileClient(data.user.id, email, username)
        } catch (profileError) {
          console.error("[v0] Profile creation failed:", profileError)
          // Continue anyway - profile might exist
        }

        setUser({
          ...data.user,
          theme: (data.user.user_metadata?.theme as any) || "dark",
        })
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Registration failed"
      setError(errorMsg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      setUser(null)
      setError(null)
    } catch (err) {
      console.error("[v0] Logout failed:", err)
    }
  }

  const updateTheme = async (theme: "light" | "dark" | "system") => {
    try {
      const supabase = createClient()

      if (!user) return

      const { error } = await supabase.auth.updateUser({
        data: { theme },
      })

      if (error) throw error

      setUser((prev) => (prev ? { ...prev, theme } : null))
    } catch (err) {
      console.error("[v0] Theme update failed:", err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, updateTheme }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
