import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface AnalysisDisplayProps {
  analysis: any
}

export function AnalysisDisplay({ analysis }: AnalysisDisplayProps) {
  const signalColor = {
    BUY: "bg-green-500/20 text-green-700 dark:text-green-400",
    SELL: "bg-red-500/20 text-red-700 dark:text-red-400",
    HOLD: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  }

  const signalIcon = {
    BUY: <TrendingUp className="w-5 h-5" />,
    SELL: <TrendingDown className="w-5 h-5" />,
    HOLD: <AlertCircle className="w-5 h-5" />,
  }

  return (
    <div className="space-y-4">
      {/* Main Signal Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{analysis.pair}</CardTitle>
              <CardDescription>Timeframe: {analysis.timeframe}</CardDescription>
            </div>
            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${signalColor[analysis.signal]}`}>
              {signalIcon[analysis.signal]}
              <span className="font-bold text-lg">{analysis.signal}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Confiança</p>
              <p className="text-2xl font-bold text-primary">{analysis.confidence}%</p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${analysis.confidence}%` }}></div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Padrão</p>
              <p className="font-semibold text-foreground">{analysis.pattern}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Entrada</p>
              <p className="font-bold text-foreground">{analysis.entryPrice}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Stop Loss</p>
              <p className="font-bold text-red-500">{analysis.stopLoss}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Take Profit</p>
              <p className="font-bold text-green-500">{analysis.takeProfit}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Risco</p>
              <p className="font-bold text-foreground">{analysis.riskPercentage}%</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Recompensa</p>
              <p className="font-bold text-foreground">{analysis.rewardPercentage}%</p>
            </div>
          </div>

          {/* Indicators */}
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm font-semibold">Indicadores Técnicos</p>
            <div className="space-y-2">
              {analysis.technicalIndicators?.map((indicator: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">{indicator.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-background rounded h-2">
                      <div
                        className={`h-2 rounded ${
                          indicator.status === "BULLISH"
                            ? "bg-green-500"
                            : indicator.status === "BEARISH"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                        style={{ width: `${indicator.strength}%` }}
                      ></div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {indicator.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Text */}
          <div className="pt-4 border-t bg-muted p-3 rounded">
            <p className="text-sm text-foreground leading-relaxed">{analysis.analysis}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
