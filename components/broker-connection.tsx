"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react"

interface BrokerConnectionProps {
  onConnected: (connected: boolean) => void
  isConnected: boolean
}

const BROKER_INFO = {
  xm: {
    name: "XM",
    description: "Corretora forex profissional",
    platforms: ["MetaTrader 4", "MetaTrader 5"],
    requiresSecret: false,
    color: "bg-blue-500",
  },
  binance: {
    name: "Binance",
    description: "Maior exchange de criptomoedas",
    platforms: ["Binance Trading", "Binance Futures"],
    requiresSecret: true,
    color: "bg-yellow-500",
  },
  bybit: {
    name: "Bybit",
    description: "Exchange de criptomoedas com derivados",
    platforms: ["Bybit Spot", "Bybit Futures"],
    requiresSecret: true,
    color: "bg-purple-500",
  },
  exness: {
    name: "Exness",
    description: "Corretora forex e CFD",
    platforms: ["MetaTrader 4", "MetaTrader 5", "cTrader"],
    requiresSecret: false,
    color: "bg-indigo-500",
  },
  mt5: {
    name: "MetaTrader 5",
    description: "Plataforma de trading universalizada",
    platforms: ["MT5"],
    requiresSecret: false,
    color: "bg-gray-600",
  },
  thinkorswim: {
    name: "ThinkOrSwim",
    description: "Plataforma de trading TD Ameritrade",
    platforms: ["ThinkOrSwim"],
    requiresSecret: true,
    color: "bg-orange-500",
  },
  "interactive-brokers": {
    name: "Interactive Brokers",
    description: "Corretora global profissional",
    platforms: ["TWS", "Client Portal"],
    requiresSecret: true,
    color: "bg-green-600",
  },
  oanda: {
    name: "OANDA",
    description: "Corretora forex regulada",
    platforms: ["OANDA Trading"],
    requiresSecret: true,
    color: "bg-red-500",
  },
}

export function BrokerConnection({ onConnected, isConnected }: BrokerConnectionProps) {
  const [broker, setBroker] = useState<string>("")
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionData, setConnectionData] = useState<any>(null)

  const currentBroker = broker && BROKER_INFO[broker as keyof typeof BROKER_INFO]

  const handleConnect = async () => {
    if (!broker || !apiKey) {
      setError("Preencha todos os campos obrigatórios")
      return
    }

    if (currentBroker?.requiresSecret && !apiSecret) {
      setError("API Secret é obrigatória para esta corretora")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const response = await fetch("/api/broker/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ broker, apiKey, apiSecret }),
      })

      if (!response.ok) {
        throw new Error("Falha ao conectar à corretora")
      }

      const data = await response.json()
      setConnectionData(data)
      onConnected(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao conectar")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setConnectionData(null)
    onConnected(false)
    setApiKey("")
    setApiSecret("")
    setBroker("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Conectar Corretora</CardTitle>
            <CardDescription>Integre sua corretora de trading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Corretora</Label>
              <Select value={broker} onValueChange={setBroker} disabled={isConnected}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma corretora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xm">XM - Corretora Forex</SelectItem>
                  <SelectItem value="exness">Exness - Forex & CFD</SelectItem>
                  <SelectItem value="binance">Binance - Criptomoedas</SelectItem>
                  <SelectItem value="bybit">Bybit - Cripto Derivados</SelectItem>
                  <SelectItem value="mt5">MetaTrader 5</SelectItem>
                  <SelectItem value="thinkorswim">ThinkOrSwim</SelectItem>
                  <SelectItem value="interactive-brokers">Interactive Brokers</SelectItem>
                  <SelectItem value="oanda">OANDA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentBroker && (
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-600 dark:text-blue-400 text-sm">
                  <p className="font-semibold">{currentBroker.name}</p>
                  <p>{currentBroker.description}</p>
                  <p className="text-xs mt-1">Plataformas: {currentBroker.platforms.join(", ")}</p>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Sua API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isConnected}
              />
            </div>

            {currentBroker?.requiresSecret && (
              <div className="space-y-2">
                <Label>API Secret</Label>
                <Input
                  type="password"
                  placeholder="Sua API Secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  disabled={isConnected}
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {connectionData && (
              <Alert className="bg-green-500/10 border-green-500/30">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-600 dark:text-green-400">
                  Corretora conectada com sucesso!
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={isConnecting || !broker}
              className="w-full"
              variant={isConnected ? "destructive" : "default"}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : isConnected ? (
                "Desconectar"
              ) : (
                "Conectar Corretora"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Status da Conexão</CardTitle>
          </CardHeader>
          <CardContent>
            {connectionData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Conectado com sucesso</p>
                    <p className="text-sm text-muted-foreground">
                      {connectionData.brokerName} - {new Date(connectionData.connectedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Card className="bg-muted border-0">
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground mb-1">Saldo da Conta</p>
                      <p className="text-2xl font-bold text-primary">${connectionData.balance.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted border-0">
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <Badge variant="outline" className="bg-green-500/10">
                          Online
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted border-0">
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground mb-1">Tipo de Conta</p>
                      <p className="text-lg font-semibold text-primary">{connectionData.accountType}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted border-0">
                    <CardContent className="pt-4">
                      <p className="text-xs text-muted-foreground mb-1">Pares Disponíveis</p>
                      <p className="text-lg font-semibold text-primary">{connectionData.availablePairs}</p>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-600 dark:text-blue-400">
                    Sinais em tempo real serão gerados automaticamente com base nos dados da corretora.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma corretora conectada</p>
                <p className="text-sm">Complete o formulário à esquerda para conectar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
