"use client"

import { CrmLayout } from "@/components/crm-layout"
import { TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateDealDialog } from "@/components/create-deal-dialog"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function DealsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [deals, setDeals] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const showCreateDialog = searchParams.get("create") === "true"

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/data")
        if (response.ok) {
          const data = await response.json()
          setDeals(data.deals || [])
          setCompanies(data.companies || [])
          setContacts(data.contacts || [])
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
      router.push("/deals")
    }
  }

  const totalValue = deals.reduce((sum, deal) => sum + deal.amount, 0)
  const activeDeals = deals.filter((d) => d.stage !== "Closed Won" && d.stage !== "Closed Lost")

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || companyId
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Closed Won":
        return "bg-crm-success/20 text-crm-success border-crm-success/30"
      case "Closed Lost":
        return "bg-crm-danger/20 text-crm-danger border-crm-danger/30"
      case "Negotiation":
      case "CLOSING":
        return "bg-crm-info/20 text-crm-info border-crm-info/30"
      case "Proposal":
      case "PRE-SALE":
        return "bg-crm-warning/20 text-crm-warning border-crm-warning/30"
      case "Qualified":
      case "NEW":
        return "bg-crm-purple/20 text-crm-purple border-crm-purple/30"
      default:
        return "bg-crm-purple/20 text-crm-purple border-crm-purple/30"
    }
  }
  
  const getProbabilityColor = (probability: string) => {
    const prob = probability?.toLowerCase() || ""
    if (prob.includes("high")) {
      return "bg-crm-prob-high/20 text-crm-prob-high border-crm-prob-high/30"
    } else if (prob.includes("mid") || prob.includes("medium")) {
      return "bg-crm-prob-mid/20 text-crm-prob-mid border-crm-prob-mid/30"
    } else {
      return "bg-crm-prob-low/20 text-crm-prob-low border-crm-prob-low/30"
    }
  }

  return (
    <CrmLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-crm-primary dark:text-white" />
            <h1 className="text-2xl font-semibold text-crm-text-primary">Deals</h1>
          </div>
          <Link href="/deals?create=true">
            <Button className="bg-crm-primary hover:bg-crm-primary-hover text-white cursor-pointer">
              + Create Deal
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-crm-primary" />
              <span className="text-sm text-crm-text-secondary">Total Pipeline Value</span>
            </div>
            <p className="text-2xl font-semibold text-crm-text-primary">
              ${Math.round(totalValue / 1000).toLocaleString()}K
            </p>
          </div>
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-crm-success" />
              <span className="text-sm text-crm-text-secondary">Active Deals</span>
            </div>
            <p className="text-2xl font-semibold text-crm-text-primary">{activeDeals.length}</p>
          </div>
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-crm-warning" />
              <span className="text-sm text-crm-text-secondary">Avg Deal Size</span>
            </div>
            <p className="text-2xl font-semibold text-crm-text-primary">
              ${deals.length > 0 ? Math.round(totalValue / deals.length / 1000).toLocaleString() : 0}K
            </p>
          </div>
        </div>

        {/* Deals Table */}
        {loading ? (
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6 text-center text-crm-text-secondary">
            Loading deals...
          </div>
        ) : (
          <div className="bg-crm-surface rounded-lg border border-crm-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-crm-surface-elevated border-b border-crm-border">
                <tr>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Deal Name
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Amount
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Stage
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Probability
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Company
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Close Date
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {deals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-crm-text-secondary">
                      No deals found. Create your first deal!
                    </td>
                  </tr>
                ) : (
                  deals.map((deal) => (
                    <tr
                      key={deal.id}
                      className="border-b border-crm-border hover:bg-crm-surface-elevated transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/deals/${deal.id}`}
                          className="text-crm-text-primary hover:text-crm-primary font-medium"
                        >
                          {deal.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-crm-text-primary font-medium">
                        ${deal.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getProbabilityColor(deal.probability >= 70 ? "high" : deal.probability >= 40 ? "mid" : "low")}>
                          {deal.probability >= 70 ? "HIGH" : deal.probability >= 40 ? "MID" : "LOW"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-crm-text-secondary">
                        {getCompanyName(deal.companyId)}
                      </td>
                      <td className="px-6 py-4 text-crm-text-secondary">
                        {new Date(deal.closeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={
                            deal.priority === "high"
                              ? "border-[#9d4edd] text-[#9d4edd]"
                              : "border-crm-border text-crm-text-secondary"
                          }
                        >
                          {deal.priority}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateDealDialog
        open={showCreateDialog}
        onOpenChange={handleDialogClose}
        companies={companies}
        contacts={contacts}
      />
    </CrmLayout>
  )
}

export default function DealsPage() {
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
      <DealsPageContent />
    </Suspense>
  )
}
