"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import data from "@/data/contacts.json"

export function UpcomingTasks() {
  const deals = data.deals || []

  // Get deals closing in the next 30 days
  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  const upcomingDeals = deals
    .filter((deal) => {
      const closeDate = new Date(deal.closeDate)
      return (
        closeDate >= today &&
        closeDate <= thirtyDaysFromNow &&
        deal.stage !== "Closed Won" &&
        deal.stage !== "Closed Lost"
      )
    })
    .sort((a, b) => new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime())
    .slice(0, 5)

  const getDaysUntil = (date: string) => {
    const closeDate = new Date(date)
    const diffTime = closeDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card className="bg-crm-surface border-crm-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-crm-primary" />
          <h3 className="text-lg font-semibold text-crm-text-primary">Upcoming Deadlines</h3>
        </div>
        <Link
          href="/deals"
          className="text-sm text-crm-primary hover:text-crm-primary-hover"
        >
          View all →
        </Link>
      </div>

      {upcomingDeals.length === 0 ? (
        <div className="text-center py-8 text-crm-text-secondary">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-crm-success opacity-50" />
          <p className="text-sm">No upcoming deadlines</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingDeals.map((deal) => {
            const daysUntil = getDaysUntil(deal.closeDate)
            const isUrgent = daysUntil <= 7

            return (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="block p-3 rounded-lg border border-crm-border hover:bg-crm-surface-elevated transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-crm-text-primary mb-1 line-clamp-1">
                      {deal.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          isUrgent
                            ? "bg-crm-danger/20 text-crm-danger"
                            : "bg-crm-warning/20 text-crm-warning"
                        }
                      >
                        {daysUntil === 0
                          ? "Due today"
                          : daysUntil === 1
                            ? "Due tomorrow"
                            : `${daysUntil} days`}
                      </Badge>
                      <span className="text-xs text-crm-text-secondary">
                        ${Math.round(deal.amount / 1000).toLocaleString()}K
                      </span>
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-crm-text-tertiary flex-shrink-0 ml-2" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </Card>
  )
}

