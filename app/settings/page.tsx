"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SettingsPage() {
  const { user, isLoading, logout, updateTheme } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "system">(user?.theme || "system")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    await updateTheme(newTheme)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Definições</h1>
              <p className="text-sm text-muted-foreground">Configure sua conta e preferências</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="account">Conta</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências Gerais</CardTitle>
                <CardDescription>Customize a aparência e comportamento da plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Tema</Label>
                  <div className="flex items-center gap-4">
                    <Select value={theme} onValueChange={handleThemeChange}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                    <ThemeToggle />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Escolha entre tema claro, escuro ou siga as preferências do seu sistema
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Notificações de Sinais
                  </Label>
                  <p className="text-xs text-muted-foreground">Receba alertas quando novos sinais são gerados</p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Atualizar Sinais em Tempo Real
                  </Label>
                  <p className="text-xs text-muted-foreground">Atualize os sinais automaticamente a cada 30 segundos</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trading Settings */}
          <TabsContent value="trading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Trading</CardTitle>
                <CardDescription>Defina os parâmetros padrão para suas análises</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Risco Padrão por Trade (%)</Label>
                    <Input type="number" defaultValue="2" min="0.1" max="10" step="0.1" />
                    <p className="text-xs text-muted-foreground">Percentagem do saldo para risco</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Timeframe Padrão</Label>
                    <Select defaultValue="H1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M5">5 minutos</SelectItem>
                        <SelectItem value="M15">15 minutos</SelectItem>
                        <SelectItem value="M30">30 minutos</SelectItem>
                        <SelectItem value="H1">1 hora</SelectItem>
                        <SelectItem value="H4">4 horas</SelectItem>
                        <SelectItem value="D1">Diário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    Análise Automática com Corretora Conectada
                  </Label>
                  <p className="text-xs text-muted-foreground">Gere sinais automaticamente usando dados da corretora</p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label>Pares Favoritos</Label>
                  <Input placeholder="EUR/USD, GBP/USD, USD/JPY" />
                  <p className="text-xs text-muted-foreground">Separe com vírgulas. Estes pares aparecerão primeiro</p>
                </div>

                <Button className="w-full mt-6" disabled={isSaving}>
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Guardar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
                <CardDescription>Gerencie sua conta e dados pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={user.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input type="text" value={user.username} disabled />
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label>Data de Criação</Label>
                  <Input type="text" value={new Date(user.createdAt).toLocaleDateString("pt-BR")} disabled />
                </div>

                <Alert className="mt-6">
                  <AlertDescription>Para alterar email ou password, contacte o suporte.</AlertDescription>
                </Alert>

                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-foreground mb-4">Perigo</h3>
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Fazer Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
