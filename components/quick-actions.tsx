"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Plus,
  UserPlus,
  Building2,
  TrendingUp,
  Ticket,
  Calendar,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      label: "Create Contact",
      icon: UserPlus,
      href: "/contacts?create=true",
      color: "text-[#9d4edd]",
      bgColor: "bg-[#9d4edd]/30",
    },
    {
      label: "Create Deal",
      icon: TrendingUp,
      href: "/deals?create=true",
      color: "text-crm-success",
      bgColor: "bg-crm-success/30",
    },
    {
      label: "Create Company",
      icon: Building2,
      href: "/companies?create=true",
      color: "text-crm-primary",
      bgColor: "bg-crm-primary/30",
    },
    {
      label: "Create Ticket",
      icon: Ticket,
      href: "/tickets",
      color: "text-crm-warning",
      bgColor: "bg-crm-warning/30",
    },
    {
      label: "Schedule Meeting",
      icon: Calendar,
      href: "#",
      color: "text-crm-success",
      bgColor: "bg-crm-success/30",
    },
    {
      label: "Log Call",
      icon: Phone,
      href: "#",
      color: "text-crm-primary",
      bgColor: "bg-crm-primary/30",
    },
    {
      label: "Send Email",
      icon: Mail,
      href: "#",
      color: "text-[#9d4edd]",
      bgColor: "bg-[#9d4edd]/30",
    },
  ]

  return (
    <Card className="bg-crm-surface border-crm-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="w-5 h-5 text-crm-primary" />
        <h3 className="text-lg font-semibold text-crm-text-primary">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Button
              variant="outline"
              className="w-full h-auto p-3 flex flex-col items-center gap-2 border-crm-border hover:bg-crm-surface-elevated hover:border-crm-primary transition-colors"
            >
              <div className={`${action.bgColor} p-2 rounded-lg`}>
                <action.icon className={`w-4 h-4 ${action.color}`} />
              </div>
              <span className="text-xs text-crm-text-primary">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  )
}

