"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, CheckCircle2, FileText, Handshake, Trophy } from "lucide-react"
import Link from "next/link"
import data from "@/data/contacts.json"

const pipelineStages = [
  { name: "Qualified", order: 1, icon: CheckCircle2 },
  { name: "Proposal", order: 2, icon: FileText },
  { name: "Negotiation", order: 3, icon: Handshake },
  { name: "Closed Won", order: 4, icon: Trophy },
]

export function PipelineOverview() {
  const deals = data.deals || []

  // Group deals by stage
  const dealsByStage = pipelineStages.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage.name)
    const totalValue = stageDeals.reduce((sum, d) => sum + d.amount, 0)
    return {
      ...stage,
      count: stageDeals.length,
      value: totalValue,
      deals: stageDeals,
    }
  })

  const totalPipelineValue = dealsByStage.reduce((sum, s) => sum + s.value, 0)

  const getStageColor = (stageName: string) => {
    // Assign different colors to each stage - using stronger, more vibrant colors
    switch (stageName) {
      case "Qualified":
        return {
          badge: "bg-[#9d4edd]/20 text-[#9d4edd] border-[#9d4edd]/40",
          progress: "bg-[#9d4edd]/90",
          summaryBg: "bg-[#9d4edd]/10 border-[#9d4edd]/30",
          textColor: "text-[#9d4edd]",
        }
      case "Proposal":
        return {
          badge: "bg-crm-warning/20 text-crm-warning border-crm-warning/40",
          progress: "bg-crm-warning/90",
          summaryBg: "bg-crm-warning/10 border-crm-warning/30",
          textColor: "text-crm-warning",
        }
      case "Negotiation":
        return {
          badge: "bg-crm-primary/20 text-crm-primary border-crm-primary/40",
          progress: "bg-crm-primary/90",
          summaryBg: "bg-crm-primary/10 border-crm-primary/30",
          textColor: "text-crm-primary",
        }
      case "Closed Won":
        return {
          badge: "bg-crm-success/20 text-crm-success border-crm-success/40",
          progress: "bg-crm-success",
          summaryBg: "bg-crm-success/10 border-crm-success/30",
          textColor: "text-crm-success",
        }
      default:
        return {
          badge: "bg-crm-surface-elevated text-crm-text-secondary border-crm-border",
          progress: "bg-crm-text-secondary/50",
          summaryBg: "bg-crm-surface-elevated/50 border-crm-border",
          textColor: "text-crm-text-primary",
        }
    }
  }

  return (
    <Card className="bg-crm-surface border-crm-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-crm-primary" />
          <div>
            <h3 className="text-lg font-semibold text-crm-text-primary">Sales Pipeline</h3>
            <p className="text-sm text-crm-text-secondary mt-0.5">
              Total pipeline value: ${Math.round(totalPipelineValue / 1000).toLocaleString()}K
            </p>
          </div>
        </div>
        <Link
          href="/deals"
          className="text-sm text-crm-primary hover:text-crm-primary-hover"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-4">
        {dealsByStage.map((stage) => {
          const percentage =
            totalPipelineValue > 0 ? (stage.value / totalPipelineValue) * 100 : 0
          const colors = getStageColor(stage.name)

          return (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`${colors.badge} text-xs font-medium`}
                  >
                    {stage.name}
                  </Badge>
                  <span className="text-sm text-crm-text-secondary">
                    {stage.count} {stage.count === 1 ? "deal" : "deals"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-crm-text-primary">
                    ${Math.round(stage.value / 1000).toLocaleString()}K
                  </p>
                  <p className="text-xs text-crm-text-tertiary">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-crm-surface-elevated">
                <div
                  className={`h-full transition-all rounded-full ${
                    colors.progress
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Simplified Stage Summary */}
      <div className="mt-6 pt-6 border-t border-crm-border">
        <div className="grid grid-cols-4 gap-3">
          {dealsByStage.map((stage) => {
            const colors = getStageColor(stage.name)
            const StageIcon = stage.icon
            return (
              <div
                key={stage.name}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  colors.summaryBg
                } hover:opacity-80`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className={`p-1.5 rounded-md flex-shrink-0 ${
                    colors.badge.split(" ")[0] // Use the bg color from badge
                  }`}>
                    <StageIcon className={`w-3.5 h-3.5 ${colors.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-base font-semibold ${colors.textColor}`}>
                        {stage.count}
                      </span>
                      <span className={`text-xs font-medium truncate ${colors.textColor}`}>
                        {stage.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-xs font-semibold text-crm-text-primary">
                    ${Math.round(stage.value / 1000).toLocaleString()}K
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

