"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Percent, AlertCircle } from "lucide-react"

interface Trade {
  id: number
  timestamp: Date
  pair: string
  signal: "BUY" | "SELL" | "HOLD"
  riskPercentage: number
  rewardPercentage: number
  confidence: number
  analysis: string
  entryPrice: number
  stopLoss: number
  takeProfit: number
}

interface PortfolioManagerProps {
  portfolio: {
    balance: number
    riskPerTradePercentage: number
    trades: any[]
  }
  setPortfolio: (portfolio: any) => void
  trades: Trade[]
}

export function PortfolioManager({ portfolio, setPortfolio, trades }: PortfolioManagerProps) {
  const [simulatedTrades, setSimulatedTrades] = useState<any[]>([])
  const [riskPercentage, setRiskPercentage] = useState(portfolio.riskPerTradePercentage)
  const [customBalance, setCustomBalance] = useState(portfolio.balance)

  // Calculate risk per trade in USD
  const riskPerTrade = (customBalance * riskPercentage) / 100

  // Calculate position size based on entry and stop loss
  const calculatePositionSize = (entryPrice: number, stopLoss: number, riskAmount: number) => {
    const riskPips = Math.abs(entryPrice - stopLoss)
    if (riskPips === 0) return 0
    return riskAmount / riskPips
  }

  // Simulate trades
  const simulateTrade = (trade: Trade) => {
    const positionSize = calculatePositionSize(trade.entryPrice, trade.stopLoss, riskPerTrade)
    const potentialLoss = riskPerTrade
    const potentialGain = positionSize * Math.abs(trade.takeProfit - trade.entryPrice)
    const newBalance = customBalance + potentialGain

    const simulatedTrade = {
      id: trade.id,
      pair: trade.pair,
      signal: trade.signal,
      entryPrice: trade.entryPrice,
      stopLoss: trade.stopLoss,
      takeProfit: trade.takeProfit,
      positionSize: positionSize.toFixed(2),
      riskAmount: potentialLoss.toFixed(2),
      rewardAmount: potentialGain.toFixed(2),
      newBalance: newBalance.toFixed(2),
      riskRewardRatio: (potentialGain / potentialLoss).toFixed(2),
    }

    setSimulatedTrades([simulatedTrade, ...simulatedTrades])
    setCustomBalance(newBalance)
  }

  const resetSimulation = () => {
    setSimulatedTrades([])
    setCustomBalance(portfolio.balance)
  }

  // Calculate statistics
  const totalRisk = simulatedTrades.reduce((sum, t) => sum + Number.parseFloat(t.riskAmount), 0)
  const totalReward = simulatedTrades.reduce((sum, t) => sum + Number.parseFloat(t.rewardAmount), 0)
  const winRate =
    simulatedTrades.length > 0
      ? (simulatedTrades.filter((t) => Number.parseFloat(t.rewardAmount) > 0).length / simulatedTrades.length) * 100
      : 0
  const profitLoss = totalReward - totalRisk

  return (
    <div className="space-y-6">
      {/* Risk Configuration */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-4">Configuração de Risco</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Balance Input */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Saldo da Conta ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                value={customBalance}
                onChange={(e) => setCustomBalance(Number.parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg text-foreground"
              />
            </div>
          </div>

          {/* Risk Percentage */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Risco por Operação (%)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={riskPercentage}
                  onChange={(e) => setRiskPercentage(Number.parseFloat(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg text-foreground"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Risk Display */}
        <div className="grid grid-cols-3 gap-3 mt-6 p-3 bg-background rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Risco por Operação</p>
            <p className="text-lg font-bold text-danger">${riskPerTrade.toFixed(2)}</p>
          </div>
          <div className="text-center border-l border-r border-border">
            <p className="text-xs text-muted-foreground mb-1">Saldo Disponível</p>
            <p className="text-lg font-bold text-foreground">${customBalance.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Recomendado</p>
            <p className="text-xs text-muted-foreground">1-2% por trade</p>
          </div>
        </div>
      </Card>

      {/* Available Trades to Simulate */}
      {trades.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-card-foreground mb-4">Simular Operações</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
              >
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{trade.pair}</p>
                  <p className="text-xs text-muted-foreground">
                    Entrada: ${trade.entryPrice} | SL: ${trade.stopLoss} | TP: ${trade.takeProfit}
                  </p>
                </div>
                <Button onClick={() => simulateTrade(trade)} variant="outline" size="sm" className="ml-4">
                  Simular
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Simulation Results */}
      {simulatedTrades.length > 0 && (
        <>
          <Card className="p-6 border-2 border-primary">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-card-foreground">Resumo da Simulação</h2>
              <Button onClick={resetSimulation} variant="outline" size="sm">
                Limpar
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-background rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Operações</p>
                <p className="text-2xl font-bold text-foreground">{simulatedTrades.length}</p>
              </div>

              <div className="p-3 bg-background rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Taxa de Ganho</p>
                <p className={`text-2xl font-bold ${winRate >= 50 ? "text-success" : "text-danger"}`}>
                  {winRate.toFixed(1)}%
                </p>
              </div>

              <div className="p-3 bg-background rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Risco Total</p>
                <p className="text-2xl font-bold text-danger">${totalRisk.toFixed(2)}</p>
              </div>

              <div className="p-3 bg-background rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Recompensa Total</p>
                <p className="text-2xl font-bold text-success">${totalReward.toFixed(2)}</p>
              </div>
            </div>

            <div
              className="mt-4 p-4 rounded-lg"
              style={{
                backgroundColor: profitLoss >= 0 ? "oklch(0.65 0.18 150 / 0.1)" : "oklch(0.55 0.25 25 / 0.1)",
              }}
            >
              <p className="text-xs text-muted-foreground mb-1">Lucro/Prejuízo Potencial</p>
              <p className={`text-3xl font-bold ${profitLoss >= 0 ? "text-success" : "text-danger"}`}>
                ${profitLoss.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">Novo Saldo Estimado: ${customBalance.toFixed(2)}</p>
            </div>
          </Card>

          {/* Simulation Details Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Par</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Entrada</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Tamanho Posição</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Risco</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Recompensa</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">R:R</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Novo Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {simulatedTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-border hover:bg-background/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">{trade.pair}</td>
                      <td className="px-4 py-3 text-sm text-foreground">${trade.entryPrice}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{trade.positionSize}</td>
                      <td className="px-4 py-3 text-sm text-danger">${trade.riskAmount}</td>
                      <td className="px-4 py-3 text-sm text-success">${trade.rewardAmount}</td>
                      <td className="px-4 py-3 text-sm text-primary font-bold">1:{trade.riskRewardRatio}</td>
                      <td className="px-4 py-3 text-sm font-bold text-foreground">${trade.newBalance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Risk Management Tips */}
      <Card className="p-6 border border-warning/30 bg-warning/5">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Dicas de Gerenciamento de Risco</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Nunca arrisque mais de 2% do seu saldo por operação</li>
              <li>Procure por operações com risco/recompensa de pelo menos 1:2</li>
              <li>Mantenha uma taxa de ganho acima de 40% para lucro consistente</li>
              <li>Use stop loss em TODAS as operações</li>
              <li>Registre todas as operações para análise posterior</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
