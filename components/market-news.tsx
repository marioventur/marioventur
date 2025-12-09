"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle, Globe } from "lucide-react"

interface MarketNews {
  id: string
  title: string
  asset: string
  impact: "high" | "medium" | "low"
  sentiment: "positive" | "negative" | "neutral"
  description: string
  timestamp: string
}

export function MarketNews() {
  const [news, setNews] = useState<MarketNews[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/market-news")
      if (response.ok) {
        const data = await response.json()
        setNews(data.news)
      }
    } catch (error) {
      console.error("[v0] Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    // Atualiza notícias a cada 2 minutos
    const interval = setInterval(fetchNews, 120000)
    return () => clearInterval(interval)
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-500/10 border-red-500/30"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/30"
      case "low":
        return "bg-blue-500/10 border-blue-500/30"
      default:
        return "bg-gray-500/10 border-gray-500/30"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "negative":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge variant="default">Positivo</Badge>
      case "negative":
        return <Badge variant="destructive">Negativo</Badge>
      default:
        return <Badge variant="secondary">Neutro</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <div>
              <CardTitle>Notícias de Mercado</CardTitle>
              <CardDescription>Últimas notícias dos ativos</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {news.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Carregando notícias do mercado...</p>
          ) : (
            news.map((item) => (
              <div key={item.id} className={`p-4 rounded-lg border-2 ${getImpactColor(item.impact)}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">{item.asset}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.impact === "high"
                          ? "Alto Impacto"
                          : item.impact === "medium"
                            ? "Médio Impacto"
                            : "Baixo Impacto"}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm text-foreground">{item.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(item.sentiment)}
                    {getSentimentBadge(item.sentiment)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString("pt-PT")}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
