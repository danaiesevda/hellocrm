"use client"
import {
  ArrowLeft,
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle,
  MoreHorizontal,
  ChevronDown,
  Building2,
  Users,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { Edit } from "lucide-react"
import { EditTicketDialog } from "@/components/edit-ticket-dialog"

export function TicketDetailView({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<any>(null)
  const [contact, setContact] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [keyInfoExpanded, setKeyInfoExpanded] = useState(true)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    async function loadTicket() {
      try {
        const response = await fetch("/api/data")
        if (response.ok) {
          const data = await response.json()
          const foundTicket = data.tickets?.find((t: any) => t.id === ticketId)
          if (foundTicket) {
            setTicket(foundTicket)
            setContact(data.contacts?.find((c: any) => c.id === foundTicket.contactId))
            setCompany(data.companies?.find((c: any) => c.id === foundTicket.companyId))
            setContacts(data.contacts || [])
            setCompanies(data.companies || [])
          }
        }
      } catch (error) {
        console.error("Error loading ticket:", error)
      } finally {
        setLoading(false)
      }
    }
    loadTicket()
  }, [ticketId])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-crm-bg">
        <div className="text-crm-text-secondary">Loading...</div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="h-full flex items-center justify-center bg-crm-bg">
        <div className="text-crm-text-secondary">Ticket not found</div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-crm-success/20 text-crm-success"
      case "In Progress":
        return "bg-crm-warning/20 text-crm-warning"
      default:
        return "bg-crm-danger/20 text-crm-danger"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-crm-danger text-crm-danger"
      case "Medium":
        return "border-crm-warning text-crm-warning"
      default:
        return "border-crm-border text-crm-text-secondary"
    }
  }

  return (
    <div className="h-full flex flex-col bg-crm-bg">
      {/* Top Navigation Bar */}
      <div className="bg-crm-surface border-b border-crm-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tickets" className="text-crm-text-secondary hover:text-crm-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-crm-text-secondary">Tickets</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="text-crm-text-secondary border-crm-border hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" size="icon" className="text-crm-text-secondary hover:bg-crm-surface-elevated cursor-pointer">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-6 p-6 max-w-[1800px] mx-auto">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-4">
            <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-crm-primary/20 flex items-center justify-center">
                  <Ticket className="w-8 h-8 text-crm-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-crm-text-secondary mb-1">{ticket.title}</h2>
                  <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                </div>
              </div>

              <Separator className="bg-crm-border my-4" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-crm-text-primary">Key information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setKeyInfoExpanded(!keyInfoExpanded)}
                    className="text-crm-text-secondary hover:bg-crm-surface-elevated h-auto p-1 cursor-pointer"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${keyInfoExpanded ? '' : '-rotate-90'}`} />
                  </Button>
                </div>

                {keyInfoExpanded && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: '#757575' }}>Status</label>
                    <p className="text-sm text-crm-text-primary">{ticket.status}</p>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: '#757575' }}>Priority</label>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                  {ticket.createdAt && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Created</label>
                      <p className="text-sm text-crm-text-secondary">
                        {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {ticket.updatedAt && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Updated</label>
                      <p className="text-sm text-crm-text-secondary">
                        {new Date(ticket.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {contact && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Contact</label>
                      <Link href={`/contacts/${contact.id}`} className="text-sm text-crm-text-primary hover:text-crm-primary block">
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </div>
                  )}
                  {company && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Company</label>
                      <Link href={`/companies/${company.id}`} className="text-sm text-crm-text-primary hover:text-crm-primary block">
                        {company.name}
                      </Link>
                    </div>
                  )}
                  <div>
                    <label className="text-xs block mb-1" style={{ color: '#757575' }}>Assignee</label>
                    <p className="text-sm text-crm-text-primary">Sevda Danaie</p>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Content Area */}
          <div className="flex-1 min-w-0 space-y-4">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="flex gap-2 mb-4 bg-transparent h-auto p-0">
                <TabsTrigger
                  value="details"
                  className="rounded-lg border border-crm-border bg-transparent text-crm-text-secondary hover:text-crm-text-primary hover:bg-crm-surface-elevated hover:border-crm-border data-[state=active]:bg-crm-surface-elevated data-[state=active]:border-crm-border data-[state=active]:text-crm-text-primary px-4 py-2 h-auto"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="rounded-lg border border-crm-border bg-transparent text-crm-text-secondary hover:text-crm-text-primary hover:bg-crm-surface-elevated hover:border-crm-border data-[state=active]:bg-crm-surface-elevated data-[state=active]:border-crm-border data-[state=active]:text-crm-text-primary px-4 py-2 h-auto"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-0">
                <div className="bg-crm-surface rounded-lg border border-crm-border p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-crm-text-primary mb-4">Ticket Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs block mb-1" style={{ color: '#757575' }}>Title</label>
                        <p className="text-sm text-crm-text-secondary">{ticket.title}</p>
                      </div>
                      {ticket.description && (
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Description</label>
                          <p className="text-sm text-crm-text-secondary whitespace-pre-wrap">{ticket.description}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Status</label>
                          <p className="text-sm text-crm-text-secondary">{ticket.status}</p>
                        </div>
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Priority</label>
                          <p className="text-sm text-crm-text-secondary">{ticket.priority}</p>
                        </div>
                        {ticket.createdAt && (
                          <div>
                            <label className="text-xs block mb-1" style={{ color: '#757575' }}>Created</label>
                            <p className="text-sm text-crm-text-secondary">
                              {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        )}
                        {ticket.updatedAt && (
                          <div>
                            <label className="text-xs block mb-1" style={{ color: '#757575' }}>Updated</label>
                            <p className="text-sm text-crm-text-secondary">
                              {new Date(ticket.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
                  <div className="text-center py-8 text-crm-text-secondary">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No activity yet</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-4">
            {contact && (
              <div className="bg-crm-surface rounded-lg border border-crm-border">
                <div className="p-4 border-b border-crm-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-crm-text-secondary" />
                    <h3 className="text-sm font-medium text-crm-text-primary">Contact</h3>
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/contacts/${contact.id}`} className="block p-2 rounded hover:bg-crm-surface-elevated">
                    <p className="text-sm text-crm-text-primary font-medium">{contact.firstName} {contact.lastName}</p>
                    {contact.email && (
                      <p className="text-xs text-crm-text-secondary">{contact.email}</p>
                    )}
                  </Link>
                </div>
              </div>
            )}
            {company && (
              <div className="bg-crm-surface rounded-lg border border-crm-border">
                <div className="p-4 border-b border-crm-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-crm-text-secondary" />
                    <h3 className="text-sm font-medium text-crm-text-primary">Company</h3>
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/companies/${company.id}`} className="block p-2 rounded hover:bg-crm-surface-elevated">
                    <p className="text-sm text-crm-text-primary font-medium">{company.name}</p>
                    {company.domain && (
                      <p className="text-xs text-crm-text-secondary">{company.domain}</p>
                    )}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditTicketDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        ticket={ticket}
        contacts={contacts}
        companies={companies}
        onTicketUpdated={() => {
          // Reload ticket data
          fetch("/api/data")
            .then((res) => res.json())
            .then((data) => {
              const foundTicket = data.tickets?.find((t: any) => t.id === ticketId)
              if (foundTicket) {
                setTicket(foundTicket)
                setContact(data.contacts?.find((c: any) => c.id === foundTicket.contactId))
                setCompany(data.companies?.find((c: any) => c.id === foundTicket.companyId))
                setContacts(data.contacts || [])
                setCompanies(data.companies || [])
              }
            })
            .catch((error) => console.error("Error reloading ticket:", error))
        }}
      />
    </div>
  )
}

