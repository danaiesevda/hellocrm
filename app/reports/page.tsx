"use client"

import { CrmLayout } from "@/components/crm-layout"
import { BarChart3, TrendingUp, Users, Building2, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from "recharts"

export default function ReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/data")
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !data) {
    return (
      <CrmLayout>
        <div className="p-6">
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6 text-center text-crm-text-secondary">
            Loading reports...
          </div>
        </div>
      </CrmLayout>
    )
  }

  const contacts = data.contacts || []
  const companies = data.companies || []
  const deals = data.deals || []
  const activities = data.activities || []

  // Calculate metrics
  const totalContacts = contacts.length
  const totalCompanies = companies.length
  const activeDeals = deals.filter((d: any) => d.stage !== "Closed Won" && d.stage !== "Closed Lost").length
  const totalPipelineValue = deals
    .filter((d: any) => d.stage !== "Closed Won" && d.stage !== "Closed Lost")
    .reduce((sum: number, deal: any) => sum + deal.amount, 0)

  // Sales Pipeline Data
  const pipelineStages = ["Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]
  const pipelineData = pipelineStages.map((stage) => {
    const stageDeals = deals.filter((d: any) => d.stage === stage)
    return {
      stage,
      count: stageDeals.length,
      value: stageDeals.reduce((sum: number, d: any) => sum + d.amount, 0),
    }
  })

  // Revenue by Stage
  const revenueByStage = pipelineStages.map((stage) => {
    const stageDeals = deals.filter((d: any) => d.stage === stage)
    return {
      stage,
      revenue: stageDeals.reduce((sum: number, d: any) => sum + d.amount, 0),
    }
  })

  // Activity Timeline (group by date)
  const activityTimeline = activities.reduce((acc: any, activity: any) => {
    if (activity.timestamp) {
      const date = new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      acc[date] = (acc[date] || 0) + 1
    }
    return acc
  }, {})

  const activityData = Object.entries(activityTimeline).map(([date, count]) => ({
    date,
    activities: count,
  })).sort((a, b) => {
    // Parse dates for sorting
    const dateA = new Date(a.date + ' ' + new Date().getFullYear())
    const dateB = new Date(b.date + ' ' + new Date().getFullYear())
    return dateA.getTime() - dateB.getTime()
  })

  // If no activities, create sample data for visualization
  if (activityData.length === 0) {
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      activityData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        activities: 0,
      })
    }
  }

  // Conversion Rates
  const leads = contacts.filter((c: any) => c.lifecycleStage === "Lead").length
  const opportunities = contacts.filter((c: any) => c.lifecycleStage === "Opportunity").length
  const customers = contacts.filter((c: any) => c.lifecycleStage === "Customer").length
  const totalContactsForConversion = leads + opportunities + customers

  const conversionData = [
    { name: "Leads", value: leads, color: "#9d4edd" },
    { name: "Opportunities", value: opportunities, color: "#c7375f" },
    { name: "Customers", value: customers, color: "#28a745" },
  ]

  const leadToCustomerRate = totalContactsForConversion > 0
    ? Math.round((customers / totalContactsForConversion) * 100)
    : 0

  const pipelineConfig = {
    Qualified: { label: "Qualified", color: "#9d4edd" },
    Proposal: { label: "Proposal", color: "#ffc107" },
    Negotiation: { label: "Negotiation", color: "#c7375f" },
    "Closed Won": { label: "Closed Won", color: "#28a745" },
    "Closed Lost": { label: "Closed Lost", color: "#6c757d" },
  }

  return (
    <CrmLayout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-white" />
          <h1 className="text-2xl font-semibold text-crm-text-primary">Reports & Analytics</h1>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
          <Card className="bg-crm-surface border-crm-border p-4 hover:bg-crm-surface-elevated transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-crm-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-crm-text-secondary mb-1">Total Contacts</p>
                <p className="text-xl font-semibold text-crm-text-primary">{totalContacts}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-crm-surface border-crm-border p-4 hover:bg-crm-surface-elevated transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-crm-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-crm-text-secondary mb-1">Total Companies</p>
                <p className="text-xl font-semibold text-crm-text-primary">{totalCompanies}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-crm-surface border-crm-border p-4 hover:bg-crm-surface-elevated transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-crm-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-crm-text-secondary mb-1">Active Deals</p>
                <p className="text-xl font-semibold text-crm-text-primary">{activeDeals}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-crm-surface border-crm-border p-4 hover:bg-crm-surface-elevated transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-[#9d4edd]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-crm-text-secondary mb-1">Pipeline Value</p>
                <p className="text-xl font-semibold text-crm-text-primary">
                  ${Math.round(totalPipelineValue / 1000).toLocaleString()}K
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Sales Pipeline Chart */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <h3 className="text-lg font-semibold text-crm-text-primary mb-4">Sales Pipeline</h3>
            <ChartContainer
              config={pipelineConfig}
              className="h-[250px] w-full"
            >
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-crm-border)" />
                <XAxis
                  dataKey="stage"
                  tick={{ fill: "var(--color-crm-text-secondary)" }}
                  tickLine={{ stroke: "var(--color-crm-border)" }}
                />
                <YAxis
                  tick={{ fill: "var(--color-crm-text-secondary)" }}
                  tickLine={{ stroke: "var(--color-crm-border)" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-crm-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>

          {/* Revenue by Stage Chart */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <h3 className="text-lg font-semibold text-crm-text-primary mb-4">Revenue by Stage</h3>
            <ChartContainer
              config={pipelineConfig}
              className="h-[250px] w-full"
            >
              <BarChart data={revenueByStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-crm-border)" />
                <XAxis
                  dataKey="stage"
                  tick={{ fill: "var(--color-crm-text-secondary)" }}
                  tickLine={{ stroke: "var(--color-crm-border)" }}
                />
                <YAxis
                  tick={{ fill: "var(--color-crm-text-secondary)" }}
                  tickLine={{ stroke: "var(--color-crm-border)" }}
                  tickFormatter={(value) => `$${Math.round(value / 1000).toLocaleString()}K`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => `$${value.toLocaleString()}`} />}
                />
                <Bar dataKey="revenue" fill="var(--color-crm-success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>

          {/* Activity Timeline Chart */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <h3 className="text-lg font-semibold text-crm-text-primary mb-4">Activity Timeline</h3>
            <ChartContainer
              config={{
                activities: { label: "Activities", color: "#c7375f" },
              }}
              className="h-[250px] w-full"
            >
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-crm-border)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "var(--color-crm-text-secondary)" }}
                  tickLine={{ stroke: "var(--color-crm-border)" }}
                />
                <YAxis
                  tick={{ fill: "var(--color-crm-text-secondary)" }}
                  tickLine={{ stroke: "var(--color-crm-border)" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="activities"
                  stroke="var(--color-crm-primary)"
                  fill="var(--color-crm-primary)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </Card>

          {/* Conversion Rates Chart */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <h3 className="text-lg font-semibold text-crm-text-primary mb-4">Conversion Rates</h3>
            <div className="h-[250px] flex flex-col items-center justify-center">
              <div className="mb-4">
                <p className="text-3xl font-bold text-crm-text-primary">{leadToCustomerRate}%</p>
                <p className="text-sm text-crm-text-secondary text-center">Lead to Customer Rate</p>
              </div>
              <ChartContainer
                config={{
                  Leads: { label: "Leads", color: "#9d4edd" },
                  Opportunities: { label: "Opportunities", color: "#c7375f" },
                  Customers: { label: "Customers", color: "#28a745" },
                }}
                className="h-[180px] w-full"
              >
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </Card>
        </div>
      </div>
    </CrmLayout>
  )
}
