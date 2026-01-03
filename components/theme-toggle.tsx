"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isDark ? (
          <Moon className="w-5 h-5 text-blue-500" />
        ) : (
          <Sun className="w-5 h-5 text-blue-500" />
        )}
        <div>
          <Label htmlFor="theme-toggle" className="text-sm text-crm-text-primary cursor-pointer">
            {isDark ? "Dark Theme" : "Light Theme"}
          </Label>
          <p className="text-xs text-crm-text-secondary">
            {isDark ? "Switch to light mode" : "Switch to dark mode"}
          </p>
        </div>
      </div>
      <Switch
        id="theme-toggle"
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
    </div>
  )
}

