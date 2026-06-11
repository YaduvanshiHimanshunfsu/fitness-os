"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-6 bg-zinc-700/50 rounded-full relative cursor-wait opacity-80">
        <div className="absolute right-1 top-1 w-4 h-4 bg-zinc-400 rounded-full"></div>
      </div>
    )
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`w-10 h-6 rounded-full relative transition-colors ${
        isDark ? "bg-emerald-500" : "bg-zinc-300"
      }`}
      aria-label="Toggle Dark Mode"
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          isDark ? "translate-x-5" : "translate-x-1"
        }`}
      ></div>
    </button>
  )
}
