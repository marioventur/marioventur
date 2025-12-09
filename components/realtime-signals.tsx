"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TIMEFRAMES = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1"]

export function RealtimeSignals() {
  const [signals, setSignals] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("H1")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [updateCountdown, setUpdateCountdown] = useState(5)

  const fetchSignals = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/signals/realtime?timeframe=${selectedTimeframe}`)
      if (response.ok) {
        const data = await response.json()
        setSignals(data.signals || [])
        setLastUpdate(new Date())
        setUpdateCountdown(5)

        for (const signal of data.signals || []) {
          await fetch("/api/analysis/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signal),
          }).catch((err) => console.error("[v0] Error saving signal:", err))
        }
      }
    } catch (error) {
      console.error("[v0] Error fetching signals:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSignals()
    const interval = setInterval(fetchSignals, 5000)
    return () => clearInterval(interval)
  }, [selectedTimeframe])

  useEffect(() => {
    const countdown = setInterval(() => {
      setUpdateCountdown((prev) => (prev <= 1 ? 5 : prev - 1))
    }, 1000)
    return () => clearInterval(countdown)
  }, [])

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "BUY":
        return "bg-green-500/10 border-green-500/30"
      case "SELL":
        return "bg-red-500/10 border-red-500/30"
      default:
        return "bg-yellow-500/10 border-yellow-500/30"
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "BUY":
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case "SELL":
        return <TrendingDown className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sinais em Tempo Real</CardTitle>
            <CardDescription>Atualizações a cada 5 segundos</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Próx. atualização em {updateCountdown}s</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchSignals} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-muted-foreground">Timeframe:</label>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map((tf) => (
                <SelectItem key={tf} value={tf}>
                  {tf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {signals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando sinais...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className={`p-4 rounded-lg border-2 flex flex-col justify-between animate-in fade-in-50 ${getSignalColor(signal.signal)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-foreground">{signal.pair}</p>
                    <p className="text-xs text-muted-foreground">{signal.timeframe}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSignalIcon(signal.signal)}
                    <Badge
                      variant={
                        signal.signal === "BUY" ? "default" : signal.signal === "SELL" ? "destructive" : "secondary"
                      }
                    >
                      {signal.signal}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-3 pb-3 border-t border-current border-opacity-20">
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Entrada:</span>
                    <span className="font-semibold">{signal.entryPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SL:</span>
                    <span className="font-semibold text-red-500">{signal.stopLoss}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TP:</span>
                    <span className="font-semibold text-green-500">{signal.takeProfit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confiança:</span>
                    <span className="font-semibold">{signal.confidence}%</span>
                  </div>
                </div>

                <Button size="sm" className="w-full bg-transparent" variant="outline">
                  Ver Detalhes
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
