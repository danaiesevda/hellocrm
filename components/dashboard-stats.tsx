"use client"

import { DollarSign, TrendingUp, Users, Building2, Target, Percent } from "lucide-react"
import { Card } from "@/components/ui/card"
import data from "@/data/contacts.json"

export function DashboardStats() {
  const deals = data.deals || []
  const contacts = data.contacts || []
  const companies = data.companies || []

  // Calculate metrics
  const totalPipelineValue = deals
    .filter((d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost")
    .reduce((sum, deal) => sum + deal.amount, 0)

  const activeDeals = deals.filter(
    (d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost",
  ).length

  const wonDeals = deals.filter((d) => d.stage === "Closed Won")
  const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.amount, 0)

  const winRate =
    deals.length > 0
      ? Math.round((wonDeals.length / deals.length) * 100)
      : 0

  const avgDealSize =
    deals.length > 0 ? Math.round(totalPipelineValue / deals.length) : 0

  const stats = [
    {
      label: "Total Pipeline Value",
      value: `$${Math.round(totalPipelineValue / 1000).toLocaleString()}K`,
      icon: DollarSign,
      color: "text-crm-primary",
      bgColor: "",
    },
    {
      label: "Active Deals",
      value: activeDeals.toString(),
      icon: TrendingUp,
      color: "text-crm-success",
      bgColor: "",
    },
    {
      label: "Total Revenue",
      value: `$${Math.round(totalRevenue / 1000).toLocaleString()}K`,
      icon: Target,
      color: "text-crm-warning",
      bgColor: "",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: Percent,
      color: "text-[#9d4edd]",
      bgColor: "",
    },
    {
      label: "Total Contacts",
      value: contacts.length.toString(),
      icon: Users,
      color: "text-crm-primary",
      bgColor: "",
    },
    {
      label: "Total Companies",
      value: companies.length.toString(),
      icon: Building2,
      color: "text-crm-success",
      bgColor: "",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-crm-surface border-crm-border p-4 hover:bg-crm-surface-elevated transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center flex-shrink-0">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            {stat.value && (
              <div className="flex-1 min-w-0">
                <p className="text-xs text-crm-text-secondary mb-1">{stat.label}</p>
                <p className="text-xl font-semibold text-crm-text-primary">{stat.value}</p>
              </div>
            )}
            {!stat.value && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-crm-text-primary">{stat.label}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

