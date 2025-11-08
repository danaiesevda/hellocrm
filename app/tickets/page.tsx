"use client"

import { CrmLayout } from "@/components/crm-layout"
import { Ticket, AlertCircle, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateTicketDialog } from "@/components/create-ticket-dialog"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function TicketsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tickets, setTickets] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const showCreateDialog = searchParams.get("create") === "true"

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/data")
        if (response.ok) {
          const data = await response.json()
          setTickets(data.tickets || [])
          setContacts(data.contacts || [])
          setCompanies(data.companies || [])
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      router.push("/tickets")
    }
  }

  const handleTicketCreated = async () => {
    // Reload data immediately
    try {
      const response = await fetch("/api/data")
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
        setContacts(data.contacts || [])
        setCompanies(data.companies || [])
      }
    } catch (error) {
      console.error("Error reloading data:", error)
    }
  }

  const getContactName = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId)
    return contact ? `${contact.firstName} ${contact.lastName}` : "--"
  }

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || "--"
  }

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
          <Link href="/tickets?create=true">
            <Button className="bg-crm-primary hover:bg-crm-primary-hover text-white">+ Create Ticket</Button>
          </Link>
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
        {loading ? (
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6 text-center text-crm-text-secondary">
            Loading tickets...
          </div>
        ) : (
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
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-crm-text-secondary">
                      No tickets found. Create your first ticket!
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
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
                      <td className="px-6 py-4 text-crm-text-secondary">
                        {ticket.contactId ? getContactName(ticket.contactId) : "--"}
                      </td>
                      <td className="px-6 py-4 text-crm-text-secondary">
                        {ticket.companyId ? getCompanyName(ticket.companyId) : "--"}
                      </td>
                      <td className="px-6 py-4 text-crm-text-secondary">
                        {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : "--"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateTicketDialog
        open={showCreateDialog}
        onOpenChange={handleDialogClose}
        contacts={contacts}
        companies={companies}
        onTicketCreated={handleTicketCreated}
      />
    </CrmLayout>
  )
}

export default function TicketsPage() {
  return (
    <Suspense fallback={
      <CrmLayout>
        <div className="p-6">
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6 text-center text-crm-text-secondary">
            Loading...
          </div>
        </div>
      </CrmLayout>
    }>
      <TicketsPageContent />
    </Suspense>
  )
}
