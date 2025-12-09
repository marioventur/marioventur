import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const timeframe = (formData.get("timeframe") as string) || "H1"

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const mimeType = file.type || "image/jpeg"

    const { text } = await generateText({
      model: "anthropic/claude-3-5-sonnet-20241022",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: base64,
              mimeType: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            },
            {
              type: "text",
              text: `Você é um analista técnico de Forex/Trading experiente. Analise este gráfico ${timeframe} e forneça:

1. SINAL: BUY, SELL ou HOLD (com confiança 0-100%)
2. PADRÃO: Identifique o padrão de gráfico (Double Bottom, Head & Shoulders, Triangle, etc)
3. PREÇOS:
   - Preço de Entrada (aproximado do mercado atual)
   - Stop Loss (nível de proteção)
   - Take Profit (alvo de lucro)
4. INDICADORES: RSI, MADC, Bollinger Bands, Médias Móveis (estados e valores)
5. RISCO: Percentagem de risco recomendada
6. RECOMPENSA: Percentagem potencial de recompensa
7. ANÁLISE: Explicação detalhada em português dos motivos

Responda em JSON com a seguinte estrutura:
{
  "signal": "BUY|SELL|HOLD",
  "confidence": 0-100,
  "pattern": "Nome do padrão",
  "entryPrice": "1.0850",
  "stopLoss": "1.0800",
  "takeProfit": "1.0950",
  "riskPercentage": 2.5,
  "rewardPercentage": 7.5,
  "technicalIndicators": [
    {"name": "RSI", "status": "BULLISH|BEARISH|NEUTRAL", "strength": 0-100, "value": "valor"},
    {"name": "MACD", "status": "BULLISH|BEARISH|NEUTRAL", "strength": 0-100},
    {"name": "Bollinger Bands", "status": "BULLISH|BEARISH|NEUTRAL", "strength": 0-100}
  ],
  "analysis": "Análise detalhada em português"
}`,
            },
          ],
        },
      ],
      maxOutputTokens: 2000,
    })

    try {
      const analysis = JSON.parse(text)

      const validatedAnalysis = {
        signal: analysis.signal || "HOLD",
        confidence: Math.min(100, Math.max(0, analysis.confidence || 50)),
        pattern: analysis.pattern || "Análise de Padrão",
        pair: "Análise de Gráfico Carregado",
        timeframe: timeframe,
        entryPrice: analysis.entryPrice || "0.0000",
        stopLoss: analysis.stopLoss || "0.0000",
        takeProfit: analysis.takeProfit || "0.0000",
        riskPercentage: analysis.riskPercentage || 2.0,
        rewardPercentage: analysis.rewardPercentage || 5.0,
        technicalIndicators: analysis.technicalIndicators || [
          { name: "RSI", status: "NEUTRAL", strength: 50, value: "50" },
          { name: "MACD", status: "NEUTRAL", strength: 50 },
          { name: "Bollinger Bands", status: "NEUTRAL", strength: 50 },
        ],
        analysis: analysis.analysis || "Análise completa disponível",
        aiGenerated: true,
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json(validatedAnalysis)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return NextResponse.json({
        signal: "HOLD",
        confidence: 50,
        pattern: "Análise de Gráfico",
        pair: "Análise de Gráfico Carregado",
        timeframe: timeframe,
        analysis: text,
        aiGenerated: true,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("[v0] Analysis error:", error)
    return NextResponse.json(
      { error: "Erro ao analisar o gráfico: " + (error instanceof Error ? error.message : "Desconhecido") },
      { status: 500 },
    )
  }
}
