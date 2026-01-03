"use client"

import { CrmLayout } from "@/components/crm-layout"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateCompanyDialog } from "@/components/create-company-dialog"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function CompaniesPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const showCreateDialog = searchParams.get("create") === "true"

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/data")
        if (response.ok) {
          const data = await response.json()
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
      router.push("/companies")
    }
  }

  return (
    <CrmLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-semibold text-crm-text-primary">Companies</h1>
          </div>
          <Link href="/companies?create=true">
            <Button className="bg-crm-primary hover:bg-crm-primary-hover text-white cursor-pointer">
              + Create Company
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6 text-center text-crm-text-secondary">
            Loading companies...
          </div>
        ) : (
          <div className="bg-crm-surface rounded-lg border border-crm-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-crm-surface-elevated border-b border-crm-border">
                <tr>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Company Name
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Domain
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Industry
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Employees
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Revenue
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Stage
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-crm-text-secondary">
                      No companies found. Create your first company!
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr
                      key={company.id}
                      className="border-b border-crm-border hover:bg-crm-surface-elevated transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/companies/${company.id}`}
                          className="text-crm-text-primary hover:text-crm-primary font-medium flex items-center gap-2"
                        >
                          <div className="w-8 h-8 rounded bg-crm-primary/20 flex items-center justify-center text-crm-primary font-medium text-sm flex-shrink-0">
                            {company.name.charAt(0)}
                          </div>
                          {company.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-crm-text-secondary">{company.domain || "--"}</td>
                      <td className="px-6 py-4 text-crm-text-secondary">{company.industry || "--"}</td>
                      <td className="px-6 py-4 text-crm-text-secondary">{company.employees || "--"}</td>
                      <td className="px-6 py-4 text-crm-text-secondary">{company.revenue || "--"}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            company.lifecycleStage === "Customer"
                              ? "bg-crm-success/20 text-crm-success"
                              : "bg-crm-primary/20 text-crm-primary"
                          }
                        >
                          {company.lifecycleStage || "Lead"}
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

      <CreateCompanyDialog open={showCreateDialog} onOpenChange={handleDialogClose}       />
    </CrmLayout>
  )
}

export default function CompaniesPage() {
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
      <CompaniesPageContent />
    </Suspense>
  )
}
