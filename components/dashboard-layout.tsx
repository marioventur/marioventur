"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, LogOut, Settings, BarChart3 } from "lucide-react"
import { ChartAnalysis } from "@/components/chart-analysis"
import { BrokerConnection } from "@/components/broker-connection"
import { RealtimeSignals } from "@/components/realtime-signals"
import { TradeHistory } from "@/components/trade-history"
import { MarketNews } from "@/components/market-news"
import Link from "next/link"

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const [trades, setTrades] = useState([])
  const [brokerConnected, setBrokerConnected] = useState(false)
  const [activeTab, setActiveTab] = useState("signals")

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Trading AI Pro</h1>
                <p className="text-xs text-muted-foreground">Análise avançada em tempo real</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Bem-vindo, <span className="font-semibold">{user?.username}</span>
              </span>
              <ThemeToggle />
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/analytics" title="Análise de Desempenho">
                  <BarChart3 className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-8">
            <TabsTrigger value="signals">Sinais em Tempo Real</TabsTrigger>
            <TabsTrigger value="chart">Upload Gráfico</TabsTrigger>
            <TabsTrigger value="broker">Corretora</TabsTrigger>
            <TabsTrigger value="news">Notícias</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Real-Time Signals Tab */}
          <TabsContent value="signals" className="space-y-6">
            <RealtimeSignals />
          </TabsContent>

          {/* Chart Analysis Tab */}
          <TabsContent value="chart" className="space-y-6">
            <ChartAnalysis onTrade={(trade) => setTrades([trade, ...trades])} />
          </TabsContent>

          {/* Broker Connection Tab */}
          <TabsContent value="broker" className="space-y-6">
            <BrokerConnection
              onConnected={(connected) => setBrokerConnected(connected)}
              isConnected={brokerConnected}
            />
          </TabsContent>

          {/* Market News Tab */}
          <TabsContent value="news" className="space-y-6">
            <MarketNews />
          </TabsContent>

          {/* Trade History Tab */}
          <TabsContent value="history" className="space-y-6">
            <TradeHistory trades={trades} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
