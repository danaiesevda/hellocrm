"use client"

import { Card } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp } from "lucide-react"
import data from "@/data/contacts.json"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--crm-primary))",
  },
} satisfies ChartConfig

export function RevenueTrends() {
  const deals = data.deals || []

  // Group deals by month (simplified - using close dates)
  const monthlyData = [
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ]

  deals.forEach((deal) => {
    if (deal.stage === "Closed Won") {
      const date = new Date(deal.closeDate)
      const monthIndex = date.getMonth()
      // November is index 10, December is 11
      if (monthIndex === 10) {
        monthlyData[2].revenue += deal.amount
      } else if (monthIndex === 11) {
        monthlyData[3].revenue += deal.amount
      }
    }
  })

  // Add some sample data for previous months
  monthlyData[0].revenue = 45000
  monthlyData[1].revenue = 62000

  return (
    <Card className="bg-crm-surface border-crm-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-crm-primary" />
        <h3 className="text-lg font-semibold text-crm-text-primary">Revenue Trends</h3>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px]">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--crm-border))" />
          <XAxis
            dataKey="month"
            tick={{ fill: "hsl(var(--crm-text-secondary))" }}
            axisLine={{ stroke: "hsl(var(--crm-border))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--crm-text-secondary))" }}
            axisLine={{ stroke: "hsl(var(--crm-border))" }}
            tickFormatter={(value) => `$${Math.round(value / 1000).toLocaleString()}K`}
          />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => `$${value.toLocaleString()}`} />} />
          <Bar
            dataKey="revenue"
            fill="hsl(var(--crm-primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  )
}

