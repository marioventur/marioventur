// User and Trading Types
export interface User {
  id: string
  email: string
  username: string
  theme: "light" | "dark" | "system"
  createdAt: Date
}

export interface TradingAccount {
  id: string
  userId: string
  accountName: string
  accountType: "demo" | "live"
  broker: "manual" | "mt5" | "thinkorswim" | "interactive-brokers" | "oanda" | "xm" | "binance" | "bybit" | "exness"
  apiKey?: string
  apiSecret?: string
  balance: number
  riskPercentage: number
  createdAt: Date
}

export interface Analysis {
  id: string
  userId: string
  sourceType: "chart" | "broker-feed" | "manual"
  signal: "BUY" | "SELL" | "HOLD"
  confidence: number
  pair: string
  timeframe: string
  entryPrice: number
  stopLoss: number
  takeProfit: number
  riskPercentage: number
  rewardPercentage: number
  reasoning: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}
