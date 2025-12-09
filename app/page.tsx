import { redirect } from "next/navigation"

export const metadata = {
  title: "Forex Trading AI - Análise Técnica Automática",
  description: "IA de análise técnica em tempo real para operações forex",
}

export default function Home() {
  redirect("/auth")
  // return <Dashboard />
}
