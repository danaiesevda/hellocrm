"use client"

import type React from "react"
import { Home, Users, Building2, TrendingUp, Ticket, BarChart3, Settings, Search, Bell, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Deals", href: "/deals", icon: TrendingUp },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Reports", href: "/reports", icon: BarChart3 },
]

export function CrmLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine which logo to use based on theme
  const logoSrc = mounted && theme === "dark" ? "/hello-white.png" : "/hello-black.png"

  return (
    <div className="flex h-screen bg-crm-bg">
      {/* Left Sidebar */}
      <div className="w-20 bg-crm-surface border-r border-crm-border flex flex-col items-center pt-1 pb-4 gap-6">
        {/* Logo */}
        <Link href="/" className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity">
          {mounted ? (
            <Image
              src={logoSrc}
              alt="HelloCRM"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-10 h-10 bg-crm-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
          )}
        </Link>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-4 flex-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                  isActive
                    ? "bg-crm-primary text-white"
                    : "text-crm-text-secondary hover:bg-crm-surface-elevated hover:text-crm-text-primary",
                )}
                title={item.name}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            )
          })}
        </nav>

        {/* Bottom Settings */}
        <Link
          href="/settings"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-crm-text-secondary hover:bg-crm-surface-elevated hover:text-crm-text-primary transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-crm-surface border-b border-crm-border flex items-center justify-between px-6 gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-crm-text-tertiary" />
            <Input
              type="search"
              placeholder="Search CRM..."
              className="w-full pl-10 bg-crm-bg border-crm-border-light text-crm-text-primary placeholder:text-crm-text-tertiary focus-visible:ring-crm-primary"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-crm-text-secondary hover:text-crm-text-primary hover:bg-crm-surface-elevated"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-crm-text-secondary hover:text-crm-text-primary hover:bg-crm-surface-elevated relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crm-primary rounded-full"></span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-crm-primary text-crm-primary hover:bg-crm-primary hover:text-white bg-transparent"
            >
              Upgrade
            </Button>
            <div className="w-8 h-8 rounded-full bg-crm-primary flex items-center justify-center text-white text-sm font-medium">
              MA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
