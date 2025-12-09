"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Trade {
  id?: string
  created_at?: string
  pair_name?: string
  pair?: string
  signal: "BUY" | "SELL" | "HOLD"
  riskPercentage?: number
  risk_percentage?: number
  rewardPercentage?: number
  reward_percentage?: number
  confidence: number
  analysis?: string
  entryPrice?: number
  entry_price?: number
  stopLoss?: number
  stop_loss?: number
  takeProfit?: number
  take_profit?: number
  timeframe?: string
}

export function TradeHistory() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/analysis/history")
        if (response.ok) {
          const data = await response.json()
          setTrades(data.data || [])
        }
      } catch (error) {
        console.error("[v0] Error fetching history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const exportTrades = () => {
    const csv = [
      ["Data", "Par", "Sinal", "Confiança", "Risco", "Recompensa", "Análise"],
      ...trades.map((trade) => [
        trade.created_at ? new Date(trade.created_at).toLocaleString("pt-BR") : "-",
        trade.pair_name || trade.pair,
        trade.signal,
        `${trade.confidence}%`,
        `${trade.risk_percentage || trade.riskPercentage}%`,
        `${trade.reward_percentage || trade.rewardPercentage}%`,
        trade.analysis || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trades_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (trades.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Nenhuma análise realizada ainda</p>
            <p className="text-sm text-muted-foreground mt-1">Comece a carregar gráficos ou conecte uma corretora</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const signalColors = {
    BUY: "bg-green-500/10 text-green-700 dark:text-green-400",
    SELL: "bg-red-500/10 text-red-700 dark:text-red-400",
    HOLD: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  }

  const signalIcons = {
    BUY: <TrendingUp className="w-4 h-4" />,
    SELL: <TrendingDown className="w-4 h-4" />,
    HOLD: <AlertCircle className="w-4 h-4" />,
  }

  const stats = {
    total: trades.length,
    buy: trades.filter((t) => t.signal === "BUY").length,
    sell: trades.filter((t) => t.signal === "SELL").length,
    avgConfidence: Math.round(trades.reduce((sum, t) => sum + t.confidence, 0) / trades.length),
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Total de Sinais</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Compras</p>
            <p className="text-2xl font-bold text-green-500">{stats.buy}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Vendas</p>
            <p className="text-2xl font-bold text-red-500">{stats.sell}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Confiança Média</p>
            <p className="text-2xl font-bold text-primary">{stats.avgConfidence}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Histórico de Análises</CardTitle>
            <CardDescription>Todas as análises realizadas na plataforma</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportTrades}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Par</TableHead>
                  <TableHead>Timeframe</TableHead>
                  <TableHead>Sinal</TableHead>
                  <TableHead>Confiança</TableHead>
                  <TableHead>Risco / Recompensa</TableHead>
                  <TableHead>Preço Entrada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade, idx) => (
                  <TableRow key={trade.id || idx} className="hover:bg-muted/50">
                    <TableCell className="text-sm">
                      {trade.created_at ? new Date(trade.created_at).toLocaleString("pt-BR") : "-"}
                    </TableCell>
                    <TableCell className="font-semibold">{trade.pair_name || trade.pair}</TableCell>
                    <TableCell>{trade.timeframe || "-"}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${signalColors[trade.signal]}`}
                      >
                        {signalIcons[trade.signal]}
                        <span className="text-xs font-bold">{trade.signal}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded h-2">
                          <div className="bg-primary h-2 rounded" style={{ width: `${trade.confidence}%` }}></div>
                        </div>
                        <span className="text-xs font-semibold">{trade.confidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="text-red-500">{trade.risk_percentage || trade.riskPercentage}%</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-green-500">{trade.reward_percentage || trade.rewardPercentage}%</span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {trade.entry_price || trade.entryPrice
                        ? `${(trade.entry_price || trade.entryPrice).toFixed(4)}`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
