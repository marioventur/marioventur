"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"

interface ChartUploadProps {
  onAnalysisComplete: (result: any) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function ChartUpload({ onAnalysisComplete, isLoading, setIsLoading }: ChartUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/analyze-chart", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Análise falhou")

      const result = await response.json()
      onAnalysisComplete(result)
    } catch (error) {
      console.error("Erro na análise:", error)
      alert("Erro ao analisar o gráfico. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-card-foreground">Upload do Gráfico</h2>

      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="chart-input"
          disabled={isLoading}
        />
        <label
          htmlFor="chart-input"
          className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-card"
        >
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-foreground">Clique para selecionar</p>
          <p className="text-xs text-muted-foreground">PNG, JPG até 10MB</p>
        </label>
      </div>

      {preview && (
        <div className="space-y-3">
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
          </div>
          <p className="text-xs text-muted-foreground truncate">{file?.name}</p>
        </div>
      )}

      <Button onClick={handleAnalyze} disabled={!preview || isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analisando...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Analisar Gráfico
          </>
        )}
      </Button>

      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-medium">Dicas:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Envie gráficos claros de forex/crypto</li>
          <li>Inclua indicadores técnicos</li>
          <li>Melhor em timeframes H1 ou superiores</li>
        </ul>
      </div>
    </Card>
  )
}
