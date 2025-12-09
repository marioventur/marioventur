"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data
const chartData = [
  { date: "Seg", accuracy: 75, signals: 5, wins: 4 },
  { date: "Ter", accuracy: 82, signals: 7, wins: 6 },
  { date: "Qua", accuracy: 68, signals: 4, wins: 2 },
  { date: "Qui", accuracy: 85, signals: 6, wins: 5 },
  { date: "Sex", accuracy: 80, signals: 8, wins: 7 },
  { date: "Sab", accuracy: 78, signals: 5, wins: 4 },
  { date: "Dom", accuracy: 83, signals: 6, wins: 5 },
]

const pairData = [
  { pair: "EUR/USD", signals: 12, accuracy: 82 },
  { pair: "GBP/USD", signals: 9, accuracy: 78 },
  { pair: "USD/JPY", signals: 7, accuracy: 75 },
  { pair: "AUD/USD", signals: 5, accuracy: 80 },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Taxa de Acerto</p>
            <p className="text-3xl font-bold text-primary">79.4%</p>
            <p className="text-xs text-green-500 mt-2">+2.5% vs semana anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Sinais Esta Semana</p>
            <p className="text-3xl font-bold text-primary">41</p>
            <p className="text-xs text-green-500 mt-2">+8 vs semana anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Razão Risco/Recompensa</p>
            <p className="text-3xl font-bold text-primary">1:2.8</p>
            <p className="text-xs text-blue-500 mt-2">Média de todos os sinais</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução Semanal</CardTitle>
          <CardDescription>Taxa de acerto e número de sinais por dia</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="accuracy"
                stroke="#3b82f6"
                name="Taxa de Acerto (%)"
                dot={{ r: 4 }}
              />
              <Line yAxisId="right" type="monotone" dataKey="signals" stroke="#10b981" name="Sinais" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho por Par</CardTitle>
          <CardDescription>Comparação de sinais e acerto por par cambial</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pairData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pair" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="signals" fill="#3b82f6" name="Sinais" />
              <Bar yAxisId="right" dataKey="accuracy" fill="#10b981" name="Acerto (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
