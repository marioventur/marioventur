"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { user, updateTheme } = useAuth()
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme)
    }
  }, [user])

  const handleToggle = async () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    await updateTheme(newTheme)

    // Apply theme to document
    const html = document.documentElement
    if (newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
