"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Loader2, AlertCircle } from "lucide-react"
import { AnalysisDisplay } from "@/components/analysis-display"

interface ChartAnalysisProps {
  onTrade: (trade: any) => void
}

export function ChartAnalysis({ onTrade }: ChartAnalysisProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState("H1")
  const [pair, setPair] = useState("EUR/USD")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setAnalysis(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError("Por favor, selecione um gráfico")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/analyze-chart", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Falha na análise do gráfico")
      }

      const result = await response.json()
      setAnalysis({ ...result, pair, timeframe })
      onTrade({ ...result, pair, timeframe, timestamp: new Date() })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao analisar")
      console.error("[v0] Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Upload Gráfico</CardTitle>
            <CardDescription>Carregue uma imagem do gráfico para análise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Par Cambial</Label>
              <Select value={pair} onValueChange={setPair}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                  <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                  <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                  <SelectItem value="AUD/USD">AUD/USD</SelectItem>
                  <SelectItem value="USD/CAD">USD/CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
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
                  <SelectItem value="W1">Semanal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Selecionar Gráfico</Label>
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {file ? file.name : "Clique ou arraste uma imagem"}
                  </span>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleAnalyze} disabled={!file || isAnalyzing} className="w-full" size="lg">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                "Analisar Gráfico"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {analysis ? (
          <AnalysisDisplay analysis={analysis} />
        ) : (
          <Card className="p-8 flex items-center justify-center h-full border-2 border-dashed">
            <div className="text-center text-muted-foreground">
              <p>Carregue um gráfico para ver a análise detalhada</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
