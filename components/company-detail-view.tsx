"use client"
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  DollarSign,
  ChevronDown,
  Building2,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { Edit } from "lucide-react"
import { EditCompanyDialog } from "@/components/edit-company-dialog"

export function CompanyDetailView({ companyId }: { companyId: string }) {
  const [company, setCompany] = useState<any>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [keyInfoExpanded, setKeyInfoExpanded] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    async function loadCompany() {
      try {
        setError(null)
        const response = await fetch("/api/data")
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        const foundCompany = data.companies?.find((c: any) => c.id === companyId)
        if (foundCompany) {
          setCompany(foundCompany)
          setContacts(data.contacts?.filter((c: any) => c.companyId === companyId) || [])
          setDeals(data.deals?.filter((d: any) => d.companyId === companyId) || [])
        } else {
          setError("Company not found")
        }
      } catch (error: any) {
        console.error("Error loading company:", error)
        setError(error?.message || "Failed to load company")
      } finally {
        setLoading(false)
      }
    }
    loadCompany()
  }, [companyId])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-crm-bg">
        <div className="text-crm-text-secondary">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-crm-bg">
        <div className="text-crm-text-secondary">Error: {error}</div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="h-full flex items-center justify-center bg-crm-bg">
        <div className="text-crm-text-secondary">Company not found</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-crm-bg">
      {/* Top Navigation Bar */}
      <div className="bg-crm-surface border-b border-crm-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/companies" className="text-crm-text-secondary hover:text-crm-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-crm-text-secondary">Companies</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (company && company.id) {
                setEditOpen(true)
              }
            }}
            disabled={!company || !company.id}
            className="text-crm-text-secondary border-crm-border hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
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
                  <Building2 className="w-8 h-8 text-crm-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-crm-text-secondary mb-1">{company.name}</h2>
                  {company.domain && (
                    <p className="text-sm text-crm-text-secondary flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      {company.domain}
                    </p>
                  )}
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
                  {company.industry && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Industry</label>
                      <p className="text-sm text-crm-text-primary">{company.industry}</p>
                    </div>
                  )}
                  {company.employees && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Employees</label>
                      <p className="text-sm text-crm-text-primary">{company.employees}</p>
                    </div>
                  )}
                  {company.revenue && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Revenue</label>
                      <p className="text-sm text-crm-text-primary">{company.revenue}</p>
                    </div>
                  )}
                  {company.phone && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Phone</label>
                      <p className="text-sm text-crm-text-secondary">{company.phone}</p>
                    </div>
                  )}
                  {company.address && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Address</label>
                      <p className="text-sm text-crm-text-secondary">{company.address}</p>
                    </div>
                  )}
                  {company.city && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>City</label>
                      <p className="text-sm text-crm-text-secondary">{company.city}</p>
                    </div>
                  )}
                  {company.country && (
                    <div>
                      <label className="text-xs block mb-1" style={{ color: '#757575' }}>Country</label>
                      <p className="text-sm text-crm-text-secondary">{company.country}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs block mb-1" style={{ color: '#757575' }}>Lifecycle Stage</label>
                    <p className="text-sm text-crm-text-primary">{company.lifecycleStage || "Lead"}</p>
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: '#757575' }}>Company owner</label>
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
                <TabsTrigger
                  value="deals"
                  className="rounded-lg border border-crm-border bg-transparent text-crm-text-secondary hover:text-crm-text-primary hover:bg-crm-surface-elevated hover:border-crm-border data-[state=active]:bg-crm-surface-elevated data-[state=active]:border-crm-border data-[state=active]:text-crm-text-primary px-4 py-2 h-auto"
                >
                  Deals
                  {deals.length > 0 && (
                    <span className="ml-2 bg-crm-surface text-crm-text-secondary rounded-full px-2 py-0.5 text-xs">
                      {deals.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="bg-crm-surface rounded-lg border border-crm-border p-6 space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-crm-text-primary mb-4">Company Information</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      {company.name && (
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Company name</label>
                          <p className="text-sm text-crm-text-secondary">{company.name}</p>
                        </div>
                      )}
                      {company.domain && (
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Domain</label>
                          <p className="text-sm text-crm-text-secondary">{company.domain}</p>
                        </div>
                      )}
                      {company.industry && (
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Industry</label>
                          <p className="text-sm text-crm-text-secondary">{company.industry}</p>
                        </div>
                      )}
                      {company.employees && (
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Employees</label>
                          <p className="text-sm text-crm-text-secondary">{company.employees}</p>
                        </div>
                      )}
                      {company.revenue && (
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Revenue</label>
                          <p className="text-sm text-crm-text-secondary">{company.revenue}</p>
                        </div>
                      )}
                      {company.phone && (
                        <div>
                          <label className="text-xs block mb-1" style={{ color: '#757575' }}>Phone</label>
                          <p className="text-sm text-crm-text-secondary">{company.phone}</p>
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

              <TabsContent value="deals" className="mt-0">
                <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
                  {deals.length === 0 ? (
                    <div className="text-center py-8 text-crm-text-secondary">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No deals found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {deals.map((deal) => (
                        <Link
                          key={deal.id}
                          href={`/deals/${deal.id}`}
                          className="block p-3 rounded-lg border border-crm-border hover:bg-crm-surface-elevated transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-crm-text-primary">{deal.name}</p>
                              <p className="text-xs text-crm-text-secondary mt-1">{deal.stage}</p>
                            </div>
                            <p className="text-sm font-semibold text-crm-text-primary">
                              ${deal.amount?.toLocaleString() || "0"}
                            </p>
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
            <div className="bg-crm-surface rounded-lg border border-crm-border">
              <div className="p-4 border-b border-crm-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-crm-text-secondary" />
                  <h3 className="text-sm font-medium text-crm-text-primary">Contacts ({contacts.length})</h3>
                </div>
                <Button size="sm" variant="ghost" className="text-crm-primary hover:bg-crm-surface-elevated h-auto p-1">
                  +Add
                </Button>
              </div>
              <div className="p-4">
                {contacts.length === 0 ? (
                  <p className="text-sm text-crm-text-secondary text-center py-4">No contacts</p>
                ) : (
                  <div className="space-y-2">
                    {contacts.slice(0, 5).map((contact) => (
                      <Link
                        key={contact.id}
                        href={`/contacts/${contact.id}`}
                        className="block p-2 rounded hover:bg-crm-surface-elevated"
                      >
                        <p className="text-sm text-crm-text-primary">{contact.firstName} {contact.lastName}</p>
                        <p className="text-xs text-crm-text-secondary">{contact.email}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-crm-surface rounded-lg border border-crm-border">
              <div className="p-4 border-b border-crm-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-crm-text-secondary" />
                  <h3 className="text-sm font-medium text-crm-text-primary">Deals ({deals.length})</h3>
                </div>
                <Button size="sm" variant="ghost" className="text-crm-primary hover:bg-crm-surface-elevated h-auto p-1">
                  +Add
                </Button>
              </div>
              <div className="p-4">
                {deals.length === 0 ? (
                  <p className="text-sm text-crm-text-secondary text-center py-4">No deals</p>
                ) : (
                  <div className="space-y-2">
                    {deals.slice(0, 5).map((deal) => (
                      <Link
                        key={deal.id}
                        href={`/deals/${deal.id}`}
                        className="block p-2 rounded hover:bg-crm-surface-elevated"
                      >
                        <p className="text-sm text-crm-text-primary">{deal.name}</p>
                        <p className="text-xs text-crm-text-secondary">${deal.amount?.toLocaleString() || "0"}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditCompanyDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        company={company}
        onCompanyUpdated={() => {
          // Reload company data
          fetch("/api/data")
            .then((res) => res.json())
            .then((data) => {
              const foundCompany = data.companies?.find((c: any) => c.id === companyId)
              if (foundCompany) {
                setCompany(foundCompany)
                setContacts(data.contacts?.filter((c: any) => c.companyId === companyId) || [])
                setDeals(data.deals?.filter((d: any) => d.companyId === companyId) || [])
              }
            })
            .catch((error) => console.error("Error reloading company:", error))
        }}
      />
    </div>
  )
}

