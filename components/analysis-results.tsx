"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface AnalysisResultsProps {
  data: {
    signal: "BUY" | "SELL" | "HOLD"
    confidence: number
    riskPercentage: number
    rewardPercentage: number
    entryPrice: string
    stopLoss: string
    takeProfit: string
    analysis: string
    technicalIndicators: {
      name: string
      status: string
      strength: number
    }[]
    pattern: string
    timeframe: string
  }
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  const signalColors = {
    BUY: "bg-success text-success-foreground",
    SELL: "bg-danger text-danger-foreground",
    HOLD: "bg-warning text-warning-foreground",
  }

  const signalIcons = {
    BUY: <TrendingUp className="w-5 h-5" />,
    SELL: <TrendingDown className="w-5 h-5" />,
    HOLD: <AlertCircle className="w-5 h-5" />,
  }

  const riskRewardRatio = (data.rewardPercentage / data.riskPercentage).toFixed(2)

  return (
    <div className="space-y-6">
      {/* Signal Card */}
      <Card className="p-6 border-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-card-foreground">Sinal de Operação</h2>
          <div className={`p-3 rounded-lg ${signalColors[data.signal]} flex items-center gap-2`}>
            {signalIcons[data.signal]}
            <span className="text-lg font-bold">{data.signal}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Confiança</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${data.confidence}%` }} />
              </div>
              <span className="text-lg font-bold text-foreground">{data.confidence}%</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Timeframe</p>
            <p className="text-lg font-bold text-foreground">{data.timeframe}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 p-3 bg-background rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Entrada</p>
            <p className="text-sm font-bold text-foreground">{data.entryPrice}</p>
          </div>
          <div className="text-center border-l border-r border-border">
            <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
            <p className="text-sm font-bold text-danger">{data.stopLoss}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
            <p className="text-sm font-bold text-success">{data.takeProfit}</p>
          </div>
        </div>
      </Card>

      {/* Risk/Reward Card */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-card-foreground mb-4">Análise de Risco</h3>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-background rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-2">Risco</p>
            <p className="text-2xl font-bold text-danger">{data.riskPercentage}%</p>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-2">Recompensa</p>
            <p className="text-2xl font-bold text-success">{data.rewardPercentage}%</p>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-2">Razão R:R</p>
            <p className="text-2xl font-bold text-primary">1:{riskRewardRatio}</p>
          </div>
        </div>
      </Card>

      {/* Pattern & Indicators */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-card-foreground mb-4">Análise Técnica</h3>

        <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-foreground mb-1">Padrão Identificado</p>
          <p className="text-base text-foreground font-semibold">{data.pattern}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Indicadores Técnicos</p>
          {data.technicalIndicators.map((indicator, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-background rounded border border-border">
              <span className="text-sm text-foreground">{indicator.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${indicator.strength}%` }} />
                </div>
                <span className="text-xs font-semibold text-foreground w-12">{indicator.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailed Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-card-foreground mb-4">Análise Detalhada</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{data.analysis}</p>
        </div>
      </Card>
    </div>
  )
}
