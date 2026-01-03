"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Phone, Mail, Calendar, FileText, User } from "lucide-react"
import data from "@/data/contacts.json"

export function RecentActivity() {
  const activities = data.activities || []
  const contacts = data.contacts || []
  const deals = data.deals || []

  // Get contact name
  const getContactName = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId)
    return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown"
  }

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call":
        return Phone
      case "email":
        return Mail
      case "meeting":
        return Calendar
      case "note":
        return FileText
      default:
        return Activity
    }
  }

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Combine activities with deal updates for a richer feed
  const recentActivities = [
    ...activities.map((activity) => ({
      ...activity,
      type: activity.type,
    })),
    // Add some sample activities based on deals
    ...deals
      .filter((d) => d.stage !== "Closed Won")
      .slice(0, 2)
      .map((deal) => ({
        id: `deal-${deal.id}`,
        type: "note",
        contactId: deal.contactIds?.[0] || "",
        title: `Deal "${deal.name}" updated to ${deal.stage}`,
        timestamp: new Date().toISOString(),
        userId: deal.ownerId,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 5)

  return (
    <Card className="bg-crm-surface border-crm-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-crm-primary" />
        <h3 className="text-lg font-semibold text-crm-text-primary">Recent Activity</h3>
      </div>

      {recentActivities.length === 0 ? (
        <div className="text-center py-8 text-crm-text-secondary">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type)

            return (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-crm-primary/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-crm-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-crm-text-primary mb-1">
                    {activity.title}
                  </p>
                  {activity.contactId && (
                    <p className="text-xs text-crm-text-secondary mb-1">
                      with {getContactName(activity.contactId)}
                    </p>
                  )}
                  <p className="text-xs text-crm-text-tertiary">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

