"use client"

import { useState } from "react"
import { ChartUpload } from "./chart-upload"
import { AnalysisResults } from "./analysis-results"
import { TradeHistory } from "./trade-history"
import { PortfolioManager } from "./portfolio-manager"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp } from "lucide-react"

export function Dashboard() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [trades, setTrades] = useState([])
  const [portfolio, setPortfolio] = useState({
    balance: 10000,
    riskPerTradePercentage: 2,
    trades: [],
  })

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result)
    const newTrade = {
      id: Date.now(),
      timestamp: new Date(),
      pair: result.pair || "EUR/USD",
      signal: result.signal,
      riskPercentage: result.riskPercentage,
      rewardPercentage: result.rewardPercentage,
      confidence: result.confidence,
      analysis: result.analysis,
      entryPrice: Number.parseFloat(result.entryPrice),
      stopLoss: Number.parseFloat(result.stopLoss),
      takeProfit: Number.parseFloat(result.takeProfit),
    }
    setTrades([newTrade, ...trades])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Forex Trading AI</h1>
                <p className="text-sm text-muted-foreground">Análise técnica automática de gráficos</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-muted-foreground">Saldo</p>
              <p className="text-2xl font-bold text-primary">${portfolio.balance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="analyze">Analisar Gráfico</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ChartUpload
                  onAnalysisComplete={handleAnalysisComplete}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>
              <div className="lg:col-span-2">
                {analysisResult ? (
                  <AnalysisResults data={analysisResult} />
                ) : (
                  <Card className="p-8 flex items-center justify-center h-full min-h-96 border-2 border-dashed border-border">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Upload uma imagem do gráfico para começar a análise</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <TradeHistory trades={trades} />
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioManager portfolio={portfolio} setPortfolio={setPortfolio} trades={trades} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
