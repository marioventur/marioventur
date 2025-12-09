import { type NextRequest, NextResponse } from "next/server"

const BROKER_DETAILS = {
  xm: {
    name: "XM",
    availablePairs: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/GBP"],
    accountType: "Live/Demo",
    spreads: "1.6 pips avg",
  },
  exness: {
    name: "Exness",
    availablePairs: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EURUSD", "Gold", "Oil"],
    accountType: "Live/Demo",
    spreads: "0.0 pips (ECN)",
  },
  binance: {
    name: "Binance",
    availablePairs: ["BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "XRP/USDT"],
    accountType: "Spot/Futures",
    spreads: "0.1% avg",
  },
  bybit: {
    name: "Bybit",
    availablePairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT", "DOGE/USDT"],
    accountType: "Spot/Perpetual",
    spreads: "0.1% avg",
  },
  mt5: {
    name: "MetaTrader 5",
    availablePairs: ["EUR/USD", "GBP/USD", "USD/JPY", "Indices", "Commodities"],
    accountType: "Universal",
    spreads: "Variable",
  },
  thinkorswim: {
    name: "ThinkOrSwim",
    availablePairs: ["Stocks", "Options", "Futures", "Forex"],
    accountType: "US Markets",
    spreads: "Variable",
  },
  "interactive-brokers": {
    name: "Interactive Brokers",
    availablePairs: ["Global Markets", "Stocks", "Options", "Futures", "Forex"],
    accountType: "Global",
    spreads: "Variable",
  },
  oanda: {
    name: "OANDA",
    availablePairs: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "EUR/GBP"],
    accountType: "Live/Demo",
    spreads: "1.0 pips avg",
  },
}

export async function POST(request: NextRequest) {
  try {
    const { broker, apiKey, apiSecret } = await request.json()

    if (!broker || !apiKey) {
      return NextResponse.json({ error: "Dados de conexão incompletos" }, { status: 400 })
    }

    const brokerDetails = BROKER_DETAILS[broker as keyof typeof BROKER_DETAILS]
    if (!brokerDetails) {
      return NextResponse.json({ error: "Corretora não suportada" }, { status: 400 })
    }

    const connection = {
      id: Math.random().toString(),
      broker,
      brokerName: brokerDetails.name,
      connected: true,
      connectedAt: new Date(),
      balance: Math.floor(Math.random() * 50000 + 10000),
      accountType: brokerDetails.accountType,
      availablePairs: brokerDetails.availablePairs.length,
      spreads: brokerDetails.spreads,
      pairsAvailable: brokerDetails.availablePairs,
    }

    return NextResponse.json(connection)
  } catch (error) {
    console.error("[v0] Broker connection error:", error)
    return NextResponse.json({ error: "Falha ao conectar broker" }, { status: 500 })
  }
}
