"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import data from "@/data/contacts.json"

export function TopDeals() {
  const deals = data.deals || []
  const companies = data.companies || []

  // Get top deals by value, excluding closed won
  const topDeals = deals
    .filter((d) => d.stage !== "Closed Won")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || companyId
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Closed Won":
        return "bg-crm-success/20 text-crm-success"
      case "Negotiation":
        return "bg-crm-warning/20 text-crm-warning"
      case "Proposal":
        return "bg-crm-primary/20 text-crm-primary"
      default:
        return "bg-crm-info/20 text-crm-info"
    }
  }

  return (
    <Card className="bg-crm-surface border-crm-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-crm-primary" />
          <h3 className="text-lg font-semibold text-crm-text-primary">Top Opportunities</h3>
        </div>
        <Link
          href="/deals"
          className="text-sm text-crm-primary hover:text-crm-primary-hover"
        >
          View all →
        </Link>
      </div>

      {topDeals.length === 0 ? (
        <div className="text-center py-8 text-crm-text-secondary">
          <p>No active deals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topDeals.map((deal) => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="block p-4 rounded-lg border border-crm-border hover:bg-crm-surface-elevated hover:border-crm-primary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-crm-text-primary mb-1">
                    {deal.name}
                  </h4>
                  <p className="text-xs text-crm-text-secondary mb-2">
                    {getCompanyName(deal.companyId)}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                    <span className="text-xs text-crm-text-tertiary">
                      {deal.probability}% probability
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-semibold text-crm-text-primary">
                    ${Math.round(deal.amount / 1000).toLocaleString()}K
                  </p>
                  <div className="flex items-center gap-1 text-xs text-crm-text-secondary mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(deal.closeDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}

