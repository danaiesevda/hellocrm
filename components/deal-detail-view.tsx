"use client"
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  TrendingUp,
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
import { EditDealDialog } from "@/components/edit-deal-dialog"

export function DealDetailView({ dealId }: { dealId: string }) {
  const [deal, setDeal] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [keyInfoExpanded, setKeyInfoExpanded] = useState(true)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    async function loadDeal() {
      try {
        const response = await fetch("/api/data")
        if (response.ok) {
          const data = await response.json()
          const foundDeal = data.deals?.find((d: any) => d.id === dealId)
          if (foundDeal) {
            setDeal(foundDeal)
            setCompany(data.companies?.find((c: any) => c.id === foundDeal.companyId))
            setContacts(data.contacts?.filter((c: any) => foundDeal.contactIds?.includes(c.id)) || [])
            setCompanies(data.companies || [])
          }
        }
      } catch (error) {
        console.error("Error loading deal:", error)
      } finally {
        setLoading(false)
      }
    }
    loadDeal()
  }, [dealId])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-crm-bg">
        <div className="text-crm-text-secondary">Loading...</div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="h-full flex items-center justify-center bg-crm-bg">
        <div className="text-crm-text-secondary">Deal not found</div>
      </div>
    )
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Closed Won":
        return "bg-crm-success/20 text-crm-success"
      case "Negotiation":
        return "bg-crm-info/20 text-crm-info"
      case "Proposal":
        return "bg-crm-warning/20 text-crm-warning"
      case "Qualified":
        return "bg-crm-purple/20 text-crm-purple"
      case "Closed Lost":
        return "bg-crm-danger/20 text-crm-danger"
      default:
        return "bg-crm-purple/20 text-crm-purple"
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) {
      return "border-crm-prob-high text-crm-prob-high"
    } else if (probability >= 40) {
      return "border-crm-prob-mid text-crm-prob-mid"
    } else {
      return "border-crm-prob-low text-crm-prob-low"
    }
  }

  return (
    <div className="h-full flex flex-col bg-crm-bg">
      {/* Top Navigation Bar */}
      <div className="bg-crm-surface border-b border-crm-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/deals" className="text-crm-text-secondary hover:text-crm-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-crm-text-secondary">Deals</span>
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
                  <TrendingUp className="w-8 h-8 text-crm-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-crm-text-secondary mb-1">{deal.name}</h2>
                  <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
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
                    <label className="text-xs block mb-1" style={{ color: '#757575' }}>Amount</label>
                    <p className="text-sm text-crm-text-primary">${deal.amount?.toLocaleString() || "0"}</p>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: '#757575' }}>Stage</label>
                    <p className="text-sm text-crm-text-primary">{deal.stage}</p>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: '#757575' }}>Probability</label>
                    <Badge variant="outline" className={getProbabilityColor(deal.probability || 0)}>
                      {deal.probability || 0}%
                    </Badge>
                  </div>
                  {deal.closeDate && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Close Date</label>
                      <p className="text-sm text-crm-text-secondary">
                        {new Date(deal.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
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
                    <label className="text-xs block mb-1" style={{ color: '#757575' }}>Deal owner</label>
                    <p className="text-sm text-crm-text-primary">Sevda Danaie</p>
                  </div>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Content Area */}
          <div className="flex-1 min-w-0 space-y-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="flex gap-2 mb-4 bg-transparent h-auto p-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-lg border border-crm-border bg-transparent text-crm-text-secondary hover:text-crm-text-primary hover:bg-crm-surface-elevated hover:border-crm-border data-[state=active]:bg-crm-surface-elevated data-[state=active]:border-crm-border data-[state=active]:text-crm-text-primary px-4 py-2 h-auto"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="contacts"
                  className="rounded-lg border border-crm-border bg-transparent text-crm-text-secondary hover:text-crm-text-primary hover:bg-crm-surface-elevated hover:border-crm-border data-[state=active]:bg-crm-surface-elevated data-[state=active]:border-crm-border data-[state=active]:text-crm-text-primary px-4 py-2 h-auto"
                >
                  Contacts
                  {contacts.length > 0 && (
                    <span className="ml-2 bg-crm-surface text-crm-text-secondary rounded-full px-2 py-0.5 text-xs">
                      {contacts.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="bg-crm-surface rounded-lg border border-crm-border p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-crm-text-primary mb-4">Deal Information</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <label className="text-xs block mb-1" style={{ color: '#757575' }}>Deal Name</label>
                        <p className="text-sm text-crm-text-secondary">{deal.name}</p>
                      </div>
                      <div>
                        <label className="text-xs block mb-1" style={{ color: '#757575' }}>Amount</label>
                        <p className="text-sm text-crm-text-secondary">${deal.amount?.toLocaleString() || "0"}</p>
                      </div>
                      <div>
                        <label className="text-xs block mb-1" style={{ color: '#757575' }}>Stage</label>
                        <p className="text-sm text-crm-text-secondary">{deal.stage}</p>
                      </div>
                      <div>
                        <label className="text-xs block mb-1" style={{ color: '#757575' }}>Probability</label>
                        <p className="text-sm text-crm-text-secondary">{deal.probability || 0}%</p>
                      </div>
                      {deal.closeDate && (
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Close Date</label>
                          <p className="text-sm text-crm-text-secondary">
                            {new Date(deal.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contacts" className="mt-0">
                <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
                  {contacts.length === 0 ? (
                    <div className="text-center py-8 text-crm-text-secondary">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No contacts found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <Link
                          key={contact.id}
                          href={`/contacts/${contact.id}`}
                          className="block p-3 rounded-lg border border-crm-border hover:bg-crm-surface-elevated transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-crm-primary/20 flex items-center justify-center text-crm-primary font-medium">
                              {contact.firstName[0]}{contact.lastName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-crm-text-primary">
                                {contact.firstName} {contact.lastName}
                              </p>
                              <p className="text-xs text-crm-text-secondary">{contact.email}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-4">
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

      <EditDealDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        deal={deal}
        companies={companies}
        onDealUpdated={() => {
          // Reload deal data
          fetch("/api/data")
            .then((res) => res.json())
            .then((data) => {
              const foundDeal = data.deals?.find((d: any) => d.id === dealId)
              if (foundDeal) {
                setDeal(foundDeal)
                setCompany(data.companies?.find((c: any) => c.id === foundDeal.companyId))
                setContacts(data.contacts?.filter((c: any) => foundDeal.contactIds?.includes(c.id)) || [])
                setCompanies(data.companies || [])
              }
            })
            .catch((error) => console.error("Error reloading deal:", error))
        }}
      />
    </div>
  )
}

