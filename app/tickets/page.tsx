import { CrmLayout } from "@/components/crm-layout"
import { Ticket, AlertCircle, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TicketsPage() {
  const tickets = [
    {
      id: "1",
      title: "Login issues with SSO",
      status: "In Progress",
      priority: "High",
      contact: "Sarah Johnson",
      company: "TechCorp Solutions",
      createdAt: "2025-11-06T10:00:00Z",
      updatedAt: "2025-11-07T15:30:00Z",
    },
    {
      id: "2",
      title: "Feature request: Export data",
      status: "New",
      priority: "Medium",
      contact: "Olly Topley",
      company: "Shell",
      createdAt: "2025-11-07T09:00:00Z",
      updatedAt: "2025-11-07T09:00:00Z",
    },
    {
      id: "3",
      title: "Billing inquiry",
      status: "Resolved",
      priority: "Low",
      contact: "Michael Chen",
      company: "Innovate Labs",
      createdAt: "2025-11-05T14:00:00Z",
      updatedAt: "2025-11-06T11:00:00Z",
    },
  ]

  const newTickets = tickets.filter((t) => t.status === "New").length
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved").length

  return (
    <CrmLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Ticket className="w-6 h-6 text-crm-primary" />
            <h1 className="text-2xl font-semibold text-crm-text-primary">Tickets</h1>
          </div>
          <Button className="bg-crm-primary hover:bg-crm-primary-hover text-white">+ Create Ticket</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-crm-danger" />
              <span className="text-sm text-crm-text-secondary">New Tickets</span>
            </div>
            <p className="text-2xl font-semibold text-crm-text-primary">{newTickets}</p>
          </div>
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-crm-warning" />
              <span className="text-sm text-crm-text-secondary">In Progress</span>
            </div>
            <p className="text-2xl font-semibold text-crm-text-primary">{inProgressTickets}</p>
          </div>
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-crm-success" />
              <span className="text-sm text-crm-text-secondary">Resolved</span>
            </div>
            <p className="text-2xl font-semibold text-crm-text-primary">{resolvedTickets}</p>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-crm-surface rounded-lg border border-crm-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-crm-surface-elevated border-b border-crm-border">
              <tr>
                <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">Ticket</th>
                <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">Status</th>
                <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">Priority</th>
                <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">Contact</th>
                <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">Company</th>
                <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-crm-border hover:bg-crm-surface-elevated transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="text-crm-text-primary hover:text-crm-primary font-medium"
                    >
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        ticket.status === "Resolved"
                          ? "bg-crm-success/20 text-crm-success"
                          : ticket.status === "In Progress"
                            ? "bg-crm-warning/20 text-crm-warning"
                            : "bg-crm-danger/20 text-crm-danger"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={
                        ticket.priority === "High"
                          ? "border-crm-danger text-crm-danger"
                          : ticket.priority === "Medium"
                            ? "border-crm-warning text-crm-warning"
                            : "border-crm-border text-crm-text-secondary"
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-crm-text-secondary">{ticket.contact}</td>
                  <td className="px-6 py-4 text-crm-text-secondary">{ticket.company}</td>
                  <td className="px-6 py-4 text-crm-text-secondary">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CrmLayout>
  )
}
