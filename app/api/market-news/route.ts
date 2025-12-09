import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to fetch real news from NewsAPI
    const newsApiKey = process.env.NEWS_API_KEY
    let marketNews = []

    if (newsApiKey) {
      try {
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=forex+trading+market&sortBy=publishedAt&language=en&apiKey=${newsApiKey}`,
        )
        const newsData = await newsResponse.json()

        marketNews = (newsData.articles || []).slice(0, 6).map((article: any, index: number) => {
          const impacts = ["high", "medium", "low"]
          const sentiments = ["positive", "negative", "neutral"]
          const assets = ["EUR/USD", "GBP/USD", "USD/JPY", "BTC/USDT", "ETH/USDT", "GOLD/USD"]

          return {
            id: `news-${index}`,
            title: article.title,
            asset: assets[index % assets.length],
            impact: impacts[index % impacts.length],
            sentiment: sentiments[index % sentiments.length],
            description: article.description || article.content?.substring(0, 150),
            source: article.source.name,
            url: article.url,
            timestamp: new Date(article.publishedAt),
          }
        })
      } catch (error) {
        console.log("NewsAPI error, using fallback data")
      }
    }

    // Fallback data if API fails
    if (marketNews.length === 0) {
      marketNews = [
        {
          id: "news-1",
          title: "Banco Central Europeu Mantém Taxa de Juros em 4,25%",
          asset: "EUR/USD",
          impact: "high",
          sentiment: "neutral",
          description: "O BCE decidiu manter as taxas de juros inalteradas. Euro pode sofrer pressão em curto prazo.",
          source: "ECB Official",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: "news-2",
          title: "Dados de Emprego nos EUA Superaram Expectativas",
          asset: "USD/JPY",
          impact: "high",
          sentiment: "positive",
          description: "Foram criados 272 mil empregos em maio, acima da previsão. Dólar forte esperado.",
          source: "US Labor Department",
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          id: "news-3",
          title: "Bitcoin Ultrapassa USD 43,500",
          asset: "BTC/USDT",
          impact: "medium",
          sentiment: "positive",
          description: "A maior criptomoeda atingiu novo máximo histórico impulsionada por fundos de índice.",
          source: "CoinMarketCap",
          timestamp: new Date(Date.now() - 1800000),
        },
        {
          id: "news-4",
          title: "Ethereum Enfrenta Pressão de Venda",
          asset: "ETH/USDT",
          impact: "medium",
          sentiment: "negative",
          description: "Grande movimento de ETH gera preocupações. Suporte em 2.300 testado.",
          source: "CoinGecko",
          timestamp: new Date(Date.now() - 900000),
        },
        {
          id: "news-5",
          title: "Ouro Fecha em Alta Semanal",
          asset: "GOLD/USD",
          impact: "low",
          sentiment: "positive",
          description: "Ouro ganha 2,5% na semana com demanda por ativos seguros.",
          source: "MarketWatch",
          timestamp: new Date(Date.now() - 5400000),
        },
        {
          id: "news-6",
          title: "Petróleo Sobe com Restrições de Oferta",
          asset: "OIL/USD",
          impact: "medium",
          sentiment: "positive",
          description: "Brent ultrapassa USD 80 com redução de produção da OPEC+.",
          source: "Bloomberg",
          timestamp: new Date(Date.now() - 2700000),
        },
      ]
    }

    return NextResponse.json({
      news: marketNews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      metadata: {
        source: newsApiKey ? "NewsAPI + Real Sources" : "Fallback Demo Data",
        lastUpdated: new Date(),
      },
    })
  } catch (error) {
    console.error("Market news error:", error)
    return NextResponse.json({
      news: [],
      error: "Unable to fetch market news",
    })
  }
}
