"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm, RegisterForm } from "@/components/auth-forms"

export default function AuthPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLogin, setIsLogin] = useState(true)

  if (user) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Forex Trading AI</h1>
          <p className="text-muted-foreground">Análise Técnica com Inteligência Artificial</p>
        </div>

        {isLogin ? (
          <LoginForm onSuccess={() => router.push("/dashboard")} />
        ) : (
          <RegisterForm onSuccess={() => router.push("/dashboard")} />
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-semibold">
              {isLogin ? "Registre-se" : "Faça login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
