"use client"

import { CrmLayout } from "@/components/crm-layout"
import { Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreateContactDialog } from "@/components/create-contact-dialog"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function ContactsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
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
      router.push("/contacts")
    }
  }

  const handleContactCreated = async () => {
    // Reload data immediately
    try {
      const response = await fetch("/api/data")
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
        setCompanies(data.companies || [])
      }
    } catch (error) {
      console.error("Error reloading data:", error)
    }
  }

  return (
    <CrmLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-crm-primary dark:text-white" />
            <h1 className="text-2xl font-semibold text-crm-text-primary">Contacts</h1>
          </div>
          <Link href="/contacts?create=true">
            <Button className="bg-crm-primary hover:bg-crm-primary-hover text-white cursor-pointer">
              + Create Contact
            </Button>
          </Link>
        </div>

        {/* Contacts Table */}
        {loading ? (
          <div className="bg-crm-surface rounded-lg border border-crm-border p-6 text-center text-crm-text-secondary">
            Loading contacts...
          </div>
        ) : (
          <div className="bg-crm-surface rounded-lg border border-crm-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-crm-surface-elevated border-b border-crm-border">
                <tr>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Name
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Email
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Company
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Job Title
                  </th>
                  <th className="text-left text-sm font-medium text-crm-text-secondary px-6 py-3">
                    Stage
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-crm-text-secondary">
                      No contacts found. Create your first contact!
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => {
                    const company = companies.find((c) => c.id === contact.companyId)
                    return (
                      <tr
                        key={contact.id}
                        className="border-b border-crm-border hover:bg-crm-surface-elevated transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/contacts/${contact.id}`}
                            className="text-crm-text-primary hover:text-crm-primary font-medium"
                          >
                            {contact.firstName} {contact.lastName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-crm-text-secondary">{contact.email}</td>
                        <td className="px-6 py-4 text-crm-text-secondary">
                          {company?.name || "--"}
                        </td>
                        <td className="px-6 py-4 text-crm-text-secondary">
                          {contact.jobTitle || "--"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-crm-primary/20 text-crm-primary">
                            {contact.lifecycleStage || "Lead"}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateContactDialog
        open={showCreateDialog}
        onOpenChange={handleDialogClose}
        companies={companies}
        onContactCreated={handleContactCreated}
      />
    </CrmLayout>
  )
}

export default function ContactsPage() {
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
      <ContactsPageContent />
    </Suspense>
  )
}
